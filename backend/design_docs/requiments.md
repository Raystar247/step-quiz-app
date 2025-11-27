# 要件定義書

## 1.1. 概要
React フロントエンドですでに開発済みの学習アプリ（STEP-Q）を、  
json-server モック API から Express + TypeScript の実 API へ移行する。

## 1.2. 目的
- 本番運用可能な API を構築する
- 認証、問題出題、回答投稿、採点、集計機能を安定提供する
- モック API の仕様を踏襲しつつ、安全性を向上する

## 1.3. 対象機能（API）
1. User（ユーザー認証）
2. QGroup（問題グループ）
3. Question（問題）
4. Trial（受験セッション）
5. Answer（回答）

## 1.4. 機能要件（Functional Requirements）
- ユーザーの新規登録 / ログイン
- QGroup への参加（パスフレーズ検証）
- Trial の自動生成または取得
- 指定インデックスの問題取得
- 回答送信
- ユーザー別 / 問題別の回答検索
- 採点処理
- QGroup / Question / Answer の参照

## 1.5. 非機能要件（Non-Functional Requirements）
- レスポンス：300ms 以内
- 同時アクセス：50req/sec 程度（想定）
- 認証：JWT アクセストークン
- ログ：JSON 形式（Winston）
- データ永続化：PostgreSQL（Prisma）

## 1.6. 技術スタック
- Node.js 20+
- Express 5 + TypeScript
- Prisma ORM
- PostgreSQL
- Docker / docker-compose
