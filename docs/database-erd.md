# Database ERD

```mermaid
erDiagram
    CATEGORY {
        TEXT id PK
        TEXT name
        TEXT kind "spend | income"
        TEXT parent_id FK "nullable"
        INTEGER sort_order
        TEXT icon
    }

    ACCOUNT {
        TEXT id PK
        TEXT name
        TEXT kind "cash | bank"
        TEXT icon "nullable"
        INTEGER opening_balance_vnd
        TEXT opening_on
        INTEGER is_archived "0 | 1"
    }

    TRANSACTION {
        TEXT id PK
        TEXT type "spend | income | transfor | lend | collect"
        TEXT occurred_on
        TEXT year_month
        TEXT account_id FK
        TEXT to_account_id FK "nullable"
        INTEGER amount_vnd
        TEXT category_id FK "nullable"
        TEXT claim_id "nullable, indexed"
        TEXT payee "nullable"
        TEXT note "nullable"
        TEXT created_at
    }

    PERSON {
        TEXT id PK
        TEXT name
        TEXT avatarUrl "nullable"
        INTEGER is_archived "0 | 1"
    }

    SPLIT_GROUP {
        TEXT id PK
        TEXT title
        INTEGER total_vnd
        INTEGER my_share_vnd
        TEXT account_id FK
        TEXT category_id FK
        TEXT spend_txn_id FK "nullable"
        TEXT occurred_at
    }

    CLAIM {
        TEXT id PK
        TEXT person_id FK
        TEXT kind "loan | share"
        INTEGER amount_vnd
        TEXT group_id FK "nullable"
        TEXT account_id FK
        TEXT note "nullable"
        TEXT opened_at
    }

    CATEGORY o|--o{ CATEGORY : "parent_id"
    ACCOUNT ||--o{ TRANSACTION : "account_id"
    ACCOUNT o|--o{ TRANSACTION : "to_account_id"
    CATEGORY o|--o{ TRANSACTION : "category_id"
    ACCOUNT ||--o{ SPLIT_GROUP : "account_id"
    CATEGORY ||--o{ SPLIT_GROUP : "category_id"
    TRANSACTION o|--o{ SPLIT_GROUP : "spend_txn_id"
    PERSON ||--o{ CLAIM : "person_id"
    SPLIT_GROUP o|--o{ CLAIM : "group_id"
    ACCOUNT ||--o{ CLAIM : "account_id"
```

`TRANSACTION.claim_id` has an index but no declared foreign-key constraint.
`SPLIT_GROUP.spend_txn_id` references `TRANSACTION.id`; a null value is allowed
when the split group's `my_share_vnd` is zero.
