# 基本設計書（外部設計）

## 2.1. API エンドポイント一覧

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /user/signup | ユーザー登録 |
| POST   | /user/signin | ログイン |
| GET    | /user/:id | ユーザー情報取得 |

### QGroup
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /qgroup | QGroup 一覧 |
| GET    | /qgroup/:id | QGroup 詳細 |
| GET    | /qgroup?title=xxx | title 検索 |

### Question
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /question | クエリ検索（qgroupId, index） |
| GET    | /question/:id | ID 取得 |

### Trial
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /trial | Trial 生成 |
| GET    | /trial | クエリ検索（qgroupId, userId, id） |
| GET    | /trial/:id | ID 指定 |

### Answer
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /answer | 回答投稿 |
| GET    | /answer | trialId / questionId などで検索 |
| PUT    | /answer/:id | 採点更新 |

---

## 2.2. データモデル（ER 図テキスト版）

```
User (1) --- (n) Trial --- (n) Answer --- (1) Question --- (n) QGroup
```

- User: id, email, passwordHash, name  
- QGroup: id, title, passphrase  
- Question: id, qgroupId, index, text  
- Trial: id, qgroupId, userId, index, startTime  
- Answer: id, trialId, questionId, answer, score, scoringStatus, memo  

---

## 2.3. 認証設計
- ログイン成功時に JWT を返す  
- 保護された API には Bearer Token を要求  

---

## 2.4. エラーレスポンス規約

```json
{
  "error": {
    "code": "INVALID_PASSWORD",
    "message": "Password is incorrect."
  }
}
```