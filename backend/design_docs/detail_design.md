# 詳細設計書（Express + TypeScript / STEPQ API）

## 1. プロジェクト構成（express-boilerplate を参考）

```
/backend
  ├── src/
  │     ├── controllers/
  │     ├── services/
  │     ├── repositories/
  │     ├── routes/
  │     ├── validators/
  │     ├── middlewares/
  │     ├── utils/
  │     ├── config/
  │     ├── types/
  │     ├── app.ts
  │     └── server.ts
  ├── prisma/
  │     ├── schema.prisma
  │     └── migrations/
  ├── package.json
  ├── tsconfig.json
  ├── .env.example
  ├── Dockerfile
  └── docker-compose.yml
```

---

## 2. 型定義（DTO / Entity）

### 2.1 User 型

```
export interface SignUpDTO {
  email: string;
  password: string;
  name: string;
}

export interface SignInDTO {
  email: string;
  password: string;
}

export interface UserEntity {
  id: string;
  email: string;
  name: string;
}
```

### 2.2 QGroup

```
export interface QGroupEntity {
  id: string;
  title: string;
  passphrase: string;
}
```

### 2.3 Question

```
export interface QuestionEntity {
  id: string;
  qgroupId: string;
  index: number;
  text: string;
}
```

### 2.4 Trial

```
export interface TrialEntity {
  id: string;
  qgroupId: string;
  userId: string;
  index: number;
  startTime: string;
}
```

### 2.5 Answer

```
export interface AnswerEntity {
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

## 3. バリデーション設計（Zod）

### 3.1 User

```
import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1)
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
```

###

### 3.2 Answer

```
export const postAnswerSchema = z.object({
  trialId: z.string().uuid(),
  questionId: z.string().uuid(),
  answer: z.string(),
  score: z.number().optional(),
  memo: z.string().optional()
});
```

---

## 4. ルーティング設計

### 4.1 User Routes

```
import { Router } from "express";
import * as controller from "../controllers/user.controller";
import { validate } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { signUpSchema, signInSchema } from "../validators/user.validator";

const router = Router();

router.post("/signup", validate(signUpSchema), controller.signUp);
router.post("/signin", validate(signInSchema), controller.signIn);
router.get("/:id", authenticate, controller.getUserInfo);

export default router;
```

### 4.2 Trial Routes

```
router.post("/", authenticate, trialController.createTrial);
router.get("/", authenticate, trialController.searchTrials);
router.get("/:id", authenticate, trialController.getTrial);
```

### 4.3 Answer Routes

```
router.post("/", authenticate, validate(postAnswerSchema), answerController.postAnswer);
router.get("/", authenticate, answerController.searchAnswers);
router.put("/:id", authenticate, answerController.updateScore);
```

---

## 5. サービス層ロジック設計（例）

### 5.1 TrialService.generateTrial

```
1. title で QGroup を検索する
2. passphrase を検証する（不一致 → 400）
3. userId + qgroupId で既存 trial を検索
4. 存在する場合 → 既存 trial.id を返す
5. 存在しない場合 → 新規 Trial 作成
6. 作成 ID を返す
```

### 5.2 AnswerService.postAnswer

```
1. trialId と questionId の整合性チェック
2. すでに回答済みであれば 409 を返す
3. 新規 Answer を Repo に保存
4. 作成 ID を返す
```

---

## 6. Repository（DBアクセス）設計

### 6.1 UserRepository

```
export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: { email: string; passwordHash: string; name: string }) {
    return prisma.user.create({ data });
  }
}
```

### 6.2 AnswerRepository

```
export class AnswerRepository {
  async create(data: Prisma.AnswerCreateInput) {
    return prisma.answer.create({ data });
  }

  async update(id: string, data: Prisma.AnswerUpdateInput) {
    return prisma.answer.update({ where: { id }, data });
  }

  async findByTrialId(trialId: string) {
    return prisma.answer.findMany({ where: { trialId } });
  }
}
```

---

## 7. 認証設計（JWT）

### JWT ペイロード

```
{
  userId: string,
  exp: number
}
```

### 認証フロー（signin）

```
1. email で user を検索
2. パスワード比較（bcrypt）
3. 正しければ JWT 発行
4. フロントへ返却
```

---

## 8. ミドルウェア設計

### 8.1 エラーハンドラー

```
(err, req, res, next) => {
  res.status(err.statusCode ?? 500).json({
    success: false,
    error: {
      code: err.code ?? "INTERNAL_ERROR",
      message: err.message
    }
  });
}
```

### 8.2 認証ミドルウェア（authenticate）

```
1. Authorization ヘッダから Bearer Token を取得
2. JWT を verify
3. req.user に userId をセット
4. 次へ
```

---

## 9. 設定管理（config/）

### config/default.ts

```
export default {
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT ?? 3000,
  databaseUrl: process.env.DATABASE_URL
};
```

---

## 10. Prisma schema

```
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  name         String
  trials       Trial[]
}

model QGroup {
  id         String     @id @default(uuid())
  title      String
  passphrase String
  questions  Question[]
  trials     Trial[]
}

model Question {
  id        String   @id @default(uuid())
  qgroupId  String
  index     Int
  text      String
  qgroup    QGroup   @relation(fields: [qgroupId], references: [id])
  answers   Answer[]
}

model Trial {
  id        String   @id @default(uuid())
  qgroupId  String
  userId    String
  index     Int
  startTime DateTime
  user      User     @relation(fields: [userId], references: [id])
  qgroup    QGroup   @relation(fields: [qgroupId], references: [id])
  answers   Answer[]
}

model Answer {
  id            String   @id @default(uuid())
  trialId       String
  questionId    String
  answer        String
  score         Int
  scoringStatus String?
  memo          String
  trial         Trial    @relation(fields: [trialId], references: [id])
  question      Question @relation(fields: [questionId], references: [id])
}
```

---

## 11. エラー設計

### 共通エラーフォーマット

```
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input"
  }
}
```

---

## 12. Express 起動フロー

### app.ts

```
1. Express インスタンス生成
2. ミドルウェア登録
3. ルート登録（/user, /qgroup など）
4. 404 ミドルウェア
5. エラーハンドラー
6. モジュールとして export
```

### server.ts

```
1. config から PORT 読み込み
2. app.listen(PORT)
3. 起動ログ出力
```

---

## 13. テスト設計

### ユニットテスト

- Service: ロジック単体テスト（Mock Repository 使用）
- Repository: In-memory DB / test SQLite で動作確認

### 統合テスト

- supertest を使い `/user/signup` など API テスト
- Docker を使いテスト DB を立てた E2E テストも可能

---

