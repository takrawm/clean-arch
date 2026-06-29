/**
 * Framework & Driver 層（Infrastructure）のコード生成テンプレート。
 * Express ルータのソース文字列を組み立てる。
 */
import { capitalize, lowercaseFirst } from "../utils";

/**
 * エンティティ用 Express ルータのソースコードを生成する。
 * コントローラを受け取り、HTTP エンドポイントとハンドラを紐づける関数を出力する。
 * @param entityName エンティティ名（ルータ関数名・コントローラ import パスに使用）
 */
export function generateRouter(entityName: string) {
  const content = `
import { Router } from "express";
import { ${capitalize(
    entityName,
  )}Controller } from "../../../adapter/controllers/${lowercaseFirst(
    entityName,
  )}Controller";

export function ${lowercaseFirst(entityName)}Routes(${lowercaseFirst(
    entityName,
  )}Controller: ${capitalize(entityName)}Controller): Router {
  const router = Router();

  // Implement routes

  return router;
}
`;
  return content.trim() + "\n";
}
