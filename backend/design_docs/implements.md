# 実装記録: STEPQ バックエンド（Express + TypeScript）

最終更新: 2025-11-28

このファイルは、バックエンド実装で行った一連の作業内容、設計上のポイント、変更した主要ファイル、テストと実行方法、今後の作業候補を日本語でまとめたものです。

**目的**
- STEPQ の Express + TypeScript バックエンドを設計書に基づいて実装する。
- Prisma を用いた DB モデル、JWT 認証、Zod による入力バリデーション、レイヤードアーキテクチャ（controllers/services/repositories）、Swagger ドキュメント、ユニット/統合テストを整備する。

---

## 実装の要約

- プロジェクト構成を `backend/` 以下に作成し、TypeScript + Express のアプリを実装しました。
- Prisma スキーマを更新し、`User`, `QGroup`, `Question`（`description` と `correctAnswer` を持つ）、`Trial`, `Answer` のモデルを定義、マイグレーションを適用しました。
- JWT 認証ミドルウェアを実装し、保護が必要なルートに `authenticate` を適用しました。
- Zod でリクエスト検証を実装し、`validation.middleware` でスキーマに沿った検証を行っています。
- Swagger（OpenAPI）スペックを `docs/openapi.yaml` に置き、`/docs` で Swagger UI を提供します。
- 単体テスト（Jest）と統合テスト（supertest）を追加し、主要な機能をテストしています。
- Postman 用のコレクションを `docs/postman_collection.json` に追加しました。

---

## 主要な修正・追加点（抜粋）

- バリデーション関連
  - `src/middlewares/validation.middleware.ts`
    - Zod スキーマを用いて `{ body, query, params }` を検証。検証後は `req.body` のみを差し替える実装に変更（`req.query` / `req.params` を直接再代入すると一部環境で読み取り専用になりエラーとなるため）。

- 認証
  - `src/middlewares/auth.middleware.ts` を追加。Authorization ヘッダの `Bearer` トークンを検証し、`req.user.userId` を設定します。

- ルーティング / コントローラ / サービス / リポジトリ
  - `src/routes/*.ts`, `src/controllers/*.ts`, `src/services/*.ts`, `src/repositories/*.ts` を追加し、以下エンドポイントを実装しました。
    - `POST /api/trial`（トライアル作成 / 既存取得）
    - `POST /api/answer`（解答登録）
    - `PUT /api/answer/:id`（解答の部分更新：`score`, `scoringStatus`, `memo`）
    - 各種 GET フィルタ（例: `/api/answers?trialId=...`）

- バリデーションスキーマ
  - `src/validators/trial.validator.ts`, `src/validators/answer.validator.ts`, `src/validators/question.validator.ts`, `src/validators/user.validator.ts`（Zod 定義）を追加。

- ドキュメント・補助
  - `docs/openapi.yaml`（OpenAPI スペック）
  - `docs/postman_collection.json`（Postman コレクション）
  - `docs/requests.md`（curl 例）

---

## テスト

- ユニットテスト
  - `src/services/__tests__/trial.service.test.ts`
  - `src/services/__tests__/answer.service.test.ts`
  - 各サービスの主要ロジック（重複チェック、作成ロジック、部分更新許可など）を単体テストで検証しています。

- 統合テスト（supertest）
  - `src/routes/__tests__/trial.routes.int.test.ts`
  - `src/routes/__tests__/answer.routes.int.test.ts`
  - 認証保護、検証（Zod）、エッジケース（パスフレーズ不一致、重複回答で 409、PUT 部分更新）をテストしています。

- テスト実行結果
  - 2025-11-28 実行時点で、バックエンドのテストは全て通過しています（4 スイート、15 テスト、すべて PASS）。

---

## 変更した主なファイル一覧（代表）

- `prisma/schema.prisma` （モデル定義、マイグレーション適用済み）
- `src/app.ts`, `src/server.ts`（アプリ起動、Swagger マウント、エラーハンドラ）
- `src/middlewares/auth.middleware.ts`（JWT 認証）
- `src/middlewares/validation.middleware.ts`（Zod 検証）
- `src/controllers/*`, `src/services/*`, `src/repositories/*`（ドメイン実装）
- `src/validators/*`（Zod スキーマ）
- `src/routes/__tests__/*`（統合テスト）
- `docs/openapi.yaml`, `docs/postman_collection.json`, `docs/requests.md`（ドキュメント）

（詳細はコミット差分を参照してください。ブランチ: `ai_backend`）

---

## 実行方法（ローカル）

1. 環境変数を設定（例: `.env`）:

```bash
cd backend
cp .env.example .env
# .env の DATABASE_URL, JWT_SECRET 等を編集
```

2. 依存インストールと Prisma 準備:

```bash
npm install
export $(cat .env | xargs)
npx prisma generate
npx prisma migrate dev --name init
```

3. 開発サーバ起動:

```bash
npm run dev
# またはビルドして起動
npm run build
npm start
```

4. テスト実行:

```bash
cd backend
npm test
```

---

## 注意点・設計上のトレードオフ

- Zod による厳密な検証で `userId` / `trialId` / `questionId` を UUID としています。テスト・クライアントが UUID を使わない場合はバリデーションを緩める必要がありますが、現状は UUID 前提です。
- 認証は簡易 JWT（secret ベース）で実装しています。プロダクション運用では鍵管理・リフレッシュトークン・ロール制御の検討が必要です。
- `validation.middleware` は `req.body` のみ書き換える形にして互換性を保っています（`req.query`/`req.params` は上書きしていません）。

---

## 今後の作業候補

- リクエスト/レスポンスの OpenAPI を完全に同期（型生成）してクライアントと厳密に整合させる。
- 追加のエンドツーエンドテスト（DB を使ったインテグレーション）を整備する。
- 権限周り（管理者・採点者など）のロール制御を実装する。
- CI (GitHub Actions) でテストと Prisma マイグレーションの自動実行を設定する。

---

もしこの実装内容について補足が必要なら、どの部分を詳しく説明するか教えてください（コントローラの流れ、Prisma スキーマ、具体的なテストケースの説明など）。



1207
次やること：Questionの取得についてBackend側のAPIに対応させる
- TOFIXで概要を記載している（検索かけて調べよう）→ 動くようにはなったが、データ型を再検討して明示するべき（エラー波線が出るから）
- important!: indexがuseStateと不整合が原因→解決
- answer.postのAPI整合
- index == nQuestions + 1で終了画面を出すように修正する