# API Request Examples (curl)

## Signup

```bash
curl -X POST http://localhost:3000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"abcdef","name":"Taro"}'
```

## Signin

```bash
curl -X POST http://localhost:3000/api/user/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"abcdef"}'
```

Save `token` from response and use for protected endpoints:

## Create / Get Trial

```bash
curl -X POST http://localhost:3000/api/trial \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"数学","passphrase":"abc123","userId":"<userId>"}'
```

## Post Answer

```bash
curl -X POST http://localhost:3000/api/answer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"trialId":"<trialId>","questionId":"<questionId>","answer":"42","score":0,"memo":""}'
```

## Update Answer (partial)

```bash
curl -X PUT http://localhost:3000/api/answer/<answerId> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"score":5,"scoringStatus":"done","memo":"Good"}'
```
