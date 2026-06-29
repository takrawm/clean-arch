/**
 * Domain 層のコード生成テンプレート。
 * エンティティクラスとリポジトリインターフェースのソース文字列を組み立てる。
 */
import { capitalize, lowercaseFirst } from "../utils";

/**
 * エンティティクラスのソースコードを生成する。
 * @param name エンティティ名（例: "user" → User クラス）
 */
export function generateEntity(name: string) {
  const content = `
export class ${capitalize(name)} {
  constructor(
    private _id: string,
    // Add other properties as needed
  ) {}

  get id(): string {
    return this._id;
  }
}
  `;
  // テンプレートリテラルはソース上の改行をそのまま \n として文字列に含める（行と行の間の改行は残る）。
  // trim(): 文字列全体の先頭・末尾の空白・改行だけを除去（開始 ` 直後の改行や、閉じ ` 直前の空白など）。
  //         各行先頭のインデント空白は trim では消えない。
  // + "\n": trim が末尾の改行も除去するため、ファイル末尾に改行を1つ戻す（POSIX / EditorConfig の慣習）。
  return content.trim() + "\n";
}

/**
 * リポジトリインターフェースのソースコードを生成する。
 * Domain 層は永続化の実装を持たず、Adapter 層がこのインターフェースを実装する。
 * @param name エンティティ名（例: "user" → UserRepositoryInterface）
 */
export function generateRepositoryInterface(name: string) {
  const content = `
import { ${capitalize(name)} } from "../entities/${lowercaseFirst(name)}";

export interface ${capitalize(name)}RepositoryInterface {
  create(${lowercaseFirst(name)}: ${capitalize(name)}): Promise<${capitalize(name)}>;
  findById(id: string): Promise<${capitalize(name)} | null>;
  // Add other methods as needed
}
  `;
  return content.trim() + "\n";
}
