import axios from 'axios';
import { ENDPOINT_URL } from '../../../references/util';

/**
 * Feature: api client
 * Purpose: axios インスタンスの作成と共有
 *
 * 内部構成
 * - domain: なし
 * - usecase: なし
 * - service/infra: axios インスタンス
 * - ui: なし
 * - hooks: なし
 * - store: なし
 */

export const axiosClient = axios.create({
    baseURL: ENDPOINT_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
