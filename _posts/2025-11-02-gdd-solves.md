---
layout: post
title: "Graph‑Driven Design : 4 cas réels où la mono‑table dégénère — et comment le graphe simplifie"
date: 2025-11-02
tags: [Graph-Driven Design, Neo4j, Data Modeling, SQL, Architecture]
description: "E‑commerce, tickets, abonnements, workflow éditorial : comparatif honnête SQL vs Graphe (modèle, requêtes, invariants, perf, migration)."
toc: true
toc_sticky: true
mermaid: true
---

# Cas réels où la mono‑table dégénère — et comment le graphe simplifie

> **Ta table “qui devait rester simple” affiche 12 booléens, 6 dates optionnelles et 3 colonnes `status`.**  
> Passons en **Graph‑Driven Design (GDD)** : les **relations portent la sémantique** (verbes, temps, rôles). Le graphe **grandit** là où la mono‑table **dégénère**.

## TL;DR — Quand passer au graphe ?

| Situation | SQL relationnel | Neo4j / GDD | Coût cognitif |
|---|---|---|---|
| CRUD simple & stable | ✅ Efficace | ⚠️ Overkill | **Faible** (SQL) |
| ≥ 3 évolutions métier ou ≥ 5 types de liens | Migrations, JOINS, triggers | **Ajout de nœuds/relations** | **Faible → Moyen** (Cypher) |
| Historique détaillé des événements | Tables log, duplication | **Relations événementielles** | **Faible** |
| Contraintes séquentielles/graphes (dépendances, escalades) | Complexe (CTE, recursions) | **Parcours natifs** | **Faible** |
| Lecture intensive | MV/Cache | **Dérivé** ou **matérialisé** | **Faible** |

---

## Méthode de comparaison

Pour chaque **use case réel**, on montre : 
1 **Mono‑table qui dégénère** (anti‑pattern)
2 **SQL bien fait** (honnête)
3 **Modèle GDD** (Mermaid)  
4 **Requêtes Cypher**  
5 **Invariants & contraintes** (contraintes Neo4j + triggers APOC)  
6 **Read model** (matérialisation optionnelle)  
7 **Migration progressive** (pas à pas)

---

## Commande e‑commerce (paiement, expédition, retour)

### 1.1 Mono‑table qui dégénère

```sql
orders(
  id, customer_id, total,
  status ENUM('PENDING','PAID','PACKED','SHIPPED','DELIVERED','RETURNED','REFUNDED'),
  is_paid BOOLEAN, is_shipped BOOLEAN, is_returned BOOLEAN, is_refunded BOOLEAN,
  cancel_reason, cancelled_at,
  shipped_at, delivered_at,
  refund_amount, refunded_at,
  tracking_number, carrier,
  return_authorized_at, return_received_at
);
```

**Pourquoi ça casse** : contradictions `status`/booléens, **multiplicité** cachée (partiels), **colonnes nulles** massives.

### 1.2 SQL « bien fait » (honnête)

```sql
CREATE TABLE orders (...);
CREATE TABLE order_payment (order_id, amount, paid_at, payment_id, PRIMARY KEY (...));
CREATE TABLE order_shipment (order_id, tracking, carrier, shipped_at, delivered_at, ...);
CREATE TABLE order_return (order_id, qty, authorized_at, received_at, ...);
CREATE TABLE order_refund (order_id, amount, refunded_at, payment_id, ...);
-- + triggers pour cohérence temporelle
```

*Mieux*, mais on **duplique la logique** (statut courant), on multiplie les **JOINs** et on **perd la sémantique du verbe**.

### 1.3 Modèle GDD (relations porteuses)
```mermaid
graph TD
  O[Order] -->|PAID {at, amount, payment_id}| P(Payment)
  O -->|SHIPPED {at, tracking, carrier}| S(Shipment)
  S -->|DELIVERED {at}| F(Facility)
  O -->|RETURNED {at, qty}| R(Return)
  R -->|REFUNDED {at, amount}| P2(Payment)
```

### 1.4 Requêtes Cypher
```cypher
// Nombre d'expéditions
MATCH (:Order {id:$id})-[:SHIPPED]->(s:Shipment) RETURN count(s);
// Statut courant dérivé
MATCH (o:Order {id:$id})<-[e:PAID|SHIPPED|DELIVERED|RETURNED|REFUNDED]-()
RETURN head(collect(type(e) ORDER BY e.at DESC)) AS current_status;
// Montant remboursé
MATCH (:Order {id:$id})<-[:REFUNDED {amount:amount}]-(r:Return) RETURN sum(amount) AS refunded;
```

### 1.5 Invariants & contraintes
```cypher
// Contraintes d'identité
CREATE CONSTRAINT order_id IF NOT EXISTS FOR (o:Order) REQUIRE o.id IS UNIQUE;
// Cohérence temporelle : DELIVERED.after(SHIPPED)
CALL apoc.trigger.add('ship->deliver','
  UNWIND $createdRelationships AS r
  WITH r WHERE type(r)="DELIVERED"
  WITH endNode(r) AS facility, startNode(r) AS shipment, r
  MATCH (o:Order)-[s:SHIPPED]->(shipment)
  CALL apoc.util.validate(s.at > r.at,"DELIVERED before SHIPPED",[])
  RETURN 0;', {phase:"before"});
// Un refund par retour
CALL apoc.trigger.add('one-refund-per-return','
  UNWIND $createdRelationships AS r
  WITH r WHERE type(r)="REFUNDED"
  CALL apoc.util.validate(EXISTS{ MATCH ()-[x:REFUNDED]->(endNode(r)) WHERE x<>r },
    "Refund already exists for this Return",[])
  RETURN 0;', {phase:"before"});
```

### 1.6 Read model (option)
```cypher
MATCH (o:Order)
OPTIONAL MATCH (o)<-[e:PAID|SHIPPED|DELIVERED|RETURNED|REFUNDED]-()
WITH o, e ORDER BY e.at
WITH o, last(collect(type(e))) AS last_event
SET o.current_status = coalesce(last_event,'PENDING');
```

### 1.7 Migration progressive
1) **Mirror** des paiements/expéditions en graphe (double‑écriture).  
2) **Découper** les rapports sur Cypher (statuts, KPI expéditions).  
3) **Basculer** la source de vérité (ordonnancer, verrouiller les invariants).

---

# 2) Ticket / Incident (assignations, escalades, SLA)

### 2.1 Mono‑table
```sql
tickets(
  id, title, description,
  status ENUM('OPEN','IN_PROGRESS','PENDING','RESOLVED','CLOSED'),
  assigned_user_id, assigned_team_id,
  is_escalated BOOLEAN, escalated_at,
  priority ENUM('P1','P2','P3'),
  sla_breach_at, customer_visible BOOLEAN,
  duplicate_of_id, relates_to_id, blocked_by_id
);
```

### 2.2 SQL « bien fait »
Tables `ticket_status_log`, `ticket_assignment`, `ticket_link(type)`, `ticket_sla_breach`.  
*OK*, mais **polymorphisme** et **historique** restent lourds.

### 2.3 Modèle GDD
```mermaid
graph TD
  T[Ticket] <-->|ASSIGNED_TO {at, active, role}| U(User)
  G(Team) -->|OWNS| T
  T -->|BLOCKED_BY| T2(Ticket)
  SLA(SLA) -->|BREACHED {at}| T
  U2(User) -->|CHANGED_STATUS {from,to,at}| T
```

### 2.4 Requêtes
```cypher
// Assignation active
MATCH (t:Ticket {id:$id})<-[a:ASSIGNED_TO]-(u:User)
WHERE coalesce(a.active,true) RETURN u.name, a.role;
// Chemin de blocage le plus court
MATCH p = shortestPath((:Ticket {id:$id})-[:BLOCKED_BY*..6]->(root:Ticket))
RETURN p;
```

### 2.5 Invariants
```cypher
// Une seule assignation active
CALL apoc.trigger.add('one-active-assignee','
  UNWIND $createdRelationships AS r
  WITH r WHERE type(r)="ASSIGNED_TO"
  MATCH (t:Ticket)<-[o:ASSIGNED_TO]-()
  WHERE endNode(r)=t AND o<>r AND coalesce(o.active,true)
  SET o.active=false
  RETURN 0;',{phase:"before"});
// Acyclicité des blocages
CALL apoc.trigger.add('blocked-acyclic','
  UNWIND $createdRelationships AS r
  WITH r WHERE type(r)="BLOCKED_BY"
  CALL apoc.util.validate( (startNode(r))<-[:BLOCKED_BY*1..]-(endNode(r)),
    "Cycle in BLOCKED_BY",[])
  RETURN 0;',{phase:"before"});
```

### 2.6 Read model
```cypher
MATCH (t:Ticket)<-[e:CHANGED_STATUS]-()
WITH t, e ORDER BY e.at
SET t.status = last(collect(e.to));
```

### 2.7 Migration
1) Écrire les **assignations** et **changements de statut** dans Neo4j.  
2) Déporter les **tableaux de bord** (SLA, goulots) sur Cypher.  
3) Verrouiller via **triggers** (unicité active, acyclicité).

---

# 3) Abonnement & facturation (essais, pauses, paiements)

### 3.1 Mono‑table
```sql
subscriptions(
  id, account_id, plan_id,
  status ENUM('TRIAL','ACTIVE','PAST_DUE','CANCELLED','PAUSED'),
  trial_end_at, cancel_at, paused_from, paused_to,
  last_payment_failed BOOLEAN, failure_reason,
  next_invoice_at, current_period_end,
  upgraded_from_plan_id, downgraded_to_plan_id
);
```

### 3.2 SQL « bien fait »
Tables `subscription_period(type)`, `invoice`, `payment_attempt`, `plan_change`.  
*OK*, mais **périodes** et **tentatives** multiplient les jointures.

### 3.3 Modèle GDD
```mermaid
graph TD
  S(Subscription) -->|TRIAL {from,to}| P1(Period)
  S -->|PAUSED {from,to}| P2(Period)
  S -->|BILLS| I(Invoice)
  PA(PaymentAttempt) -->|FOR {at, outcome, reason}| I
  S -->|CHANGED_PLAN {at, from, to}| PL(Plan)
```

### 3.4 Requêtes
```cypher
// Tentatives échouées sur la dernière facture
MATCH (s:Subscription {id:$id})-[:BILLS]->(i:Invoice)<-[:FOR {outcome:"failed"}]-(p:PaymentAttempt)
RETURN count(p);
// Périodes de pause chevauchantes (détection)
MATCH (s:Subscription)-[p:PAUSED]->(per:Period)
WITH s, collect({from:p.from,to:p.to}) AS ps
RETURN s.id WHERE apoc.coll.overlaps(ps, ps); -- idée pseudo, à implémenter avec APOC
```

### 3.5 Invariants
```cypher
// Périodes non-chevauchantes par type
CALL apoc.trigger.add('periods-no-overlap','
  UNWIND $createdRelationships AS r
  WITH r WHERE type(r) IN ["TRIAL","PAUSED"]
  WITH startNode(r) AS s, type(r) AS typ, r.from AS f, r.to AS t
  MATCH (s)-[x]->() WHERE type(x)=typ AND x<>r
  CALL apoc.util.validate( (f < x.to AND t > x.from),
    "Overlap on " + typ,[])
  RETURN 0;',{phase:"before"});
```

### 3.6 Read model
```cypher
MATCH (s:Subscription)
OPTIONAL MATCH (s)-[c:CHANGED_PLAN]->()
WITH s, c ORDER BY c.at
SET s.current_plan = last(collect(c.to));
```

### 3.7 Migration
1) **Mirror** des paiements/tentatives vers Neo4j.  
2) Calcul des **états abonnements** (past_due, paused) en Cypher.  
3) **Triggers** d’intégrité périodique.

---

# 4) Workflow éditorial (versions, reviews, publication)

### 4.1 Mono‑table
```sql
articles(
  id, title, body,
  status ENUM('DRAFT','IN_REVIEW','APPROVED','SCHEDULED','PUBLISHED','RETRACTED'),
  is_featured BOOLEAN, scheduled_at, published_at, retracted_at,
  reviewer_id, approver_id, reason, version_number,
  asset1_url, asset2_url
);
```

### 4.2 SQL « bien fait »
Tables `article_version`, `review`, `approval`, `publication`, `asset_link`.  
*OK*, mais la **généalogie des versions** + assets devient vite touffue.

### 4.3 Modèle GDD
```mermaid
graph TD
  A(Article) -->|HAS_VERSION n| V(Version)
  U1(User) -->|REVIEWED {at, outcome, comment}| V
  U2(User) -->|APPROVED {at}| V
  V -->|SCHEDULED {at}| PB(Publication)
  PB -->|PUBLISHED {at}| CH(Channel)
  V -->|USES| AS(Asset)
```

### 4.4 Requêtes
```cypher
// Dernière version approuvée non publiée
MATCH (a:Article {id:$id})-[:HAS_VERSION]->(v)
WHERE NOT EXISTS { (v)-[:PUBLISHED]->() }
  AND EXISTS { (:User)-[:APPROVED]->(v) }
RETURN v ORDER BY v.n DESC LIMIT 1;
// Arbre de versions (généalogie)
MATCH p = (a:Article {id:$id})-[:HAS_VERSION]->(v:Version)
RETURN p;
```

### 4.5 Invariants
```cypher
// APPROVED requis avant SCHEDULED
CALL apoc.trigger.add('approve-before-schedule','
  UNWIND $createdRelationships AS r
  WITH r WHERE type(r)="SCHEDULED"
  WITH startNode(r) AS v
  CALL apoc.util.validate(NOT EXISTS{ (:User)-[:APPROVED]->(v) },
    "Cannot schedule without approval",[])
  RETURN 0;',{phase:"before"});
// N° de version strictement croissant
CALL apoc.trigger.add('version-increment','
  UNWIND $createdRelationships AS r
  WITH r WHERE type(r)="HAS_VERSION"
  WITH startNode(r) AS a, endNode(r) AS v
  CALL apoc.util.validate( EXISTS{ (a)-[:HAS_VERSION]->(x:Version) WHERE x.n >= v.n },
    "Version number must increase",[])
  RETURN 0;',{phase:"before"});
```

### 4.6 Read model
```cypher
MATCH (a:Article)-[:HAS_VERSION]->(v)
WITH a, v ORDER BY v.n
SET a.latest_version = last(collect(v.n));
```

### 4.7 Migration
1) Répliquer **versions** + **reviews** dans Neo4j.  
2) **Publication** orchestrée via relations (schedule/publish/retract).  
3) **Contraintes** (approval avant schedule, versions croissantes).

---

## Démarrer en local (Docker)
```yaml
services:
  neo4j:
    image: neo4j:5
    ports: ["7474:7474","7687:7687"]
    environment:
      NEO4J_server_memory_heap_initial__size: 512m
      NEO4J_server_memory_heap_max__size: 1g
      NEO4JLABS_PLUGINS: '["apoc"]'
      NEO4J_dbms_security_procedures_unrestricted: "apoc.*"
      NEO4J_apoc_trigger_enabled: "true"
    volumes:
      - ./neo4j/data:/data
```
> Active **APOC Core** et `apoc.trigger.enabled=true` pour les invariants.

## Données d’essai (seed)
```cypher
// E‑commerce (un ordre simple)
MERGE (o:Order {id:"ORD-1001"})-[:PAID {at:datetime(), amount:120}]->(:Payment {id:"PAY-1"});
MERGE (o)-[:SHIPPED {at:datetime(), tracking:"XX123"}]->(:Shipment {id:"SHP-1"});
MERGE (o)-[:RETURNED {at:datetime(), qty:1}]->(:Return {id:"RET-1"})
      <-[:REFUNDED {at:datetime(), amount:120}]-(:Payment {id:"PAY-2"});

// Ticket
MERGE (t:Ticket {id:"T-42"})
MERGE (u:User {name:"Alexandre"})-[:ASSIGNED_TO {at:datetime(), active:true, role:"owner"}]->(t);

// Abonnement
MERGE (s:Subscription {id:"SUB-9"})
MERGE (s)-[:BILLS]->(:Invoice {id:"INV-9"})
MERGE (:PaymentAttempt {id:"ATT-1"})-[:FOR {at:datetime(), outcome:"failed"}]->(:Invoice {id:"INV-9"});

// Editorial
MERGE (a:Article {id:"ART-7"})-[:HAS_VERSION]->(:Version {n:1})
      <-[:REVIEWED {at:datetime(), outcome:"approve"}]-(:User {name:"Editor"});
```

---

## Conclusion
La **mono‑table** masque la multiplicité, entasse des booléens et dilue la sémantique.  
Le **GDD** rend ces verbes **explicites** (relations typées, datées, contextualisées), avec des **invariants vérifiables**.  
On **dérive** l’état courant, on **matérialise** si la lecture l’exige, on **migre** par étapes.

## Call‑to‑action
> **Colle ton `schema.sql` “fatigué” en commentaire.**  
> Je te propose un **mapping GDD** et 3 requêtes Cypher prêtes à l’emploi.  
> *(Promis, pas de jugement.)*