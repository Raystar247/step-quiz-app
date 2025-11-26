# STEPQ API 仕様定義書（完全版 / 日本語）

バージョン: 1.0  
作成日: 2025-xx-xx  
形式: REST / JSON  
認証: JWT（必要な API のみ）

---

# 1. 共通仕様

---

## 1.1 リクエスト形式

- Content-Type: `application/json`
- 認証が必要な API では `Authorization: Bearer <token>`

---

## 1.2 レスポンス形式（統一フォーマット）

成功時：

```
{
  "success": true,
  "data": { ... }
}
```

エラー時：

```
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "人間が理解できるエラー内容",
    "details": { }
  }
}
```

---

## 1.3 エラーコード一覧

| コード名 | 説明 |
|---------|------|
| VALIDATION_ERROR | バリデーション不正 |
| UNAUTHORIZED | JWT 不正 |
| FORBIDDEN | 権限不足 |
| NOT_FOUND | リソースが存在しない |
| CONFLICT | 一意制約 or 既存データ衝突 |
| INTERNAL_ERROR | サーバ内部エラー |
| NETWORK_ERROR | 通信失敗（クライアント側扱い） |

---

# 2. User API

---

## 2.1 POST /user/signup  
**ユーザー登録**

### ● 説明
新規ユーザーをシステムに登録する。

### ● リクエストボディ

```
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

### ● バリデーション
| フィールド | 制約 |
|-----------|------|
| email | 必須・メール形式 |
| password | 必須・6文字以上 |
| name | 必須 |

### ● 成功レスポンス

```
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Taro"
  }
}
```

---

## 2.2 POST /user/signin  
**ログイン**

### ● 説明
ユーザー認証し、JWT トークンを発行する。

### ● リクエスト

```
{
  "email": "user@example.com",
  "password": "abcdef"
}
```

### ● 成功レスポンス

```
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Taro"
    }
  }
}
```

---

## 2.3 GET /user/{id}  
**ユーザー情報取得（認証済のみ）**

### ● 成功レスポンス

```
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Taro"
  }
}
```

---

# 3. QGroup API

---

## 3.1 GET /qgroup  
**QGroup 一覧取得**

### ● クエリパラメータ
なし

### ● 成功レスポンス

```
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "数学",
      "passphrase": "abc123"
    }
  ]
}
```

---

## 3.2 GET /qgroup?title=xxx  
**タイトル検索**

---

## 3.3 GET /qgroup?qgroupId=xxx  
**ID 検索（1件のみ）**

---

# 4. Question API

---

## 4.1 GET /question?qgroupId=xxx  
**指定グループ全問題取得**

---

## 4.2 GET /question?qgroupId=xxx&index=N  
**指定番号の問題取得**

### ● 成功レスポンス

```
{
  "success": true,
  "data": {
    "id": "uuid",
    "qgroupId": "uuid",
    "index": 3,
    "text": "次の計算をせよ"
  }
}
```

---

# 5. Trial API

---

## 5.1 POST /trial  
**Trial（受験セッション）作成**

### ● 本 API の特徴（重要）
- Q1 で指定されたとおり **title + passphrase を公開**  
- 同じ (userId + qgroupId) の Trial が存在すれば → 既存 Trial を返す
- 無ければ新規作成

---

### ● リクエスト

```
{
  "title": "数学",
  "passphrase": "abc123",
  "userId": "uuid"
}
```

### ● 成功レスポンス

```
{
  "success": true,
  "data": {
    "id": "uuid",
    "qgroupId": "uuid",
    "userId": "uuid",
    "index": 1,
    "startTime": "2024-01-01T10:00:00Z"
  }
}
```

---

## 5.2 GET /trial?id=xxx  
**Trial を ID で取得**

---

## 5.3 GET /trial?qgroupId=xxx&userId=yyy  
**ユーザーの受験情報を取得**

---

# 6. Answer API

---

## 6.1 POST /answer  
**回答登録**

### ● リクエスト

```
{
  "trialId": "uuid",
  "questionId": "uuid",
  "answer": "テキスト回答",
  "score": 0,
  "memo": ""
}
```

### ● 成功レスポンス

```
{
  "success": true,
  "data": {
    "id": "uuid"
  }
}
```

---

## 6.2 GET /answer?trialId=xxx  
**指定 trial の回答一覧取得**

---

## 6.3 GET /answer?qgroupId=xxx&trialId=yyy  
**採点画面などで使用：qgroup + trial の回答一覧**

---

## 6.4 GET /answer?qgroupId=xxx&questionId=yyy  
**指定問題（questionId）の回答一覧**

---

## 6.5 PUT /answer/{id}  
**採点結果の更新**

### ● 実装ポリシー（Q2回答より）
- A（score / scoringStatus / memo だけ更新）  
- ただし「制約を強すぎると実装が難しい」ため  
- **Answer 部分更新を許可し、渡ってきたフィールドのみ更新** とする

### ● リクエスト（更新対象のみで可）

```
{
  "score": 5,
  "scoringStatus": "done",
  "memo": "丁寧に書かれていた"
}
```

---

# 7. Answer フィルタ API（Q3：B案）

---

## 7.1 GET /answers/by-user?username=xxx&qgroupId=uuid  
**指定ユーザーの回答一覧（username → userId → trialId → answer）**

### ● 成功例

```
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "questionId": "uuid",
      "answer": "回答",
      "score": 0
    }
  ]
}
```

---

## 7.2 GET /answers/by-question?qgroupId=xxx&index=N  
**指定 index の問題の全ユーザー回答一覧**

---

# 8. Helper API（利便性のため）

---

## 8.1 GET /stepq/player-answers?qgroupId=xxx&userId=yyy  
**stepqApi.fetchPlayerAnswers 相当**

---

## 8.2 GET /stepq/questions-of-qgroup?qgroupId=xxx  
**グループの全問題取得**

---

# 9. 認証関連（JWT）

---

## 9.1 認証が必要な API
- GET /user/{id}
- POST /trial
- GET /answer（全）
- POST /answer
- PUT /answer/{id}
- /answers/by-user
- /answers/by-question

ヘッダ：

```
Authorization: Bearer <jwt-token>
```

---

# 10. データ型一覧（DTO / Entity）

## 10.1 User

```
{
  id: string;
  email: string;
  name: string;
}
```

## 10.2 QGroup

```
{
  id: string;
  title: string;
  passphrase: string;
}
```

## 10.3 Question

```
{
  id: string;
  qgroupId: string;
  index: number;
  text: string;
}
```

## 10.4 Trial

```
{
  id: string;
  qgroupId: string;
  userId: string;
  index: number;
  startTime: string;
}
```

## 10.5 Answer

```
{
  id: string;
  trialId: string;
  questionId: string;
  answer: string;
  score: number;
  scoringStatus?: string | null;
  memo: string;
}
```

---

# 11. ステータスコード仕様

| status | 意味 |
|--------|------|
| 200 | 成功 |
| 201 | リソース作成 |
| 400 | 入力不正 |
| 401 | 認証エラー |
| 403 | 権限なし |
| 404 | 見つからない |
| 409 | 競合 |
| 500 | サーバエラー |

---

# 12. 今後の拡張余地

- WebSocket によるリアルタイム採点通知
- 問題のランダム出題
- アクセス権限ロール（admin / player / scorer）

---

