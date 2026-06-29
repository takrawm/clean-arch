/**
 * コード生成 CLI で共通利用するユーティリティ。
 * 命名規則の変換（PascalCase / camelCase）とファイル書き出しを担う。
 */
import fs from "fs";
import path from "path";

/**
 * 先頭文字を大文字にして PascalCase のクラス名・型名を得る。
 * @example capitalize("user") → "User"
 */
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * 先頭文字を小文字にして camelCase の変数名・ディレクトリ名を得る。
 * @example lowercaseFirst("User") → "user"
 */
export function lowercaseFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/**
 * 指定パスにファイルを書き出す。親ディレクトリがなければ再帰的に作成する。
 *
 * fs の Sync 系 API（existsSync / mkdirSync / writeFileSync）を使う理由:
 * - このツールは対話型 CLI で、1 回の実行で数ファイルを順次書き出すだけの短命プロセスである
 * - 書き込みは inquirer の入力待ちより短く、イベントループをブロックしても体感上の問題にならない
 * - writeFile を同期関数のまま保てるため、呼び出し側で await を増やさず逐次生成の流れを単純に保てる
 * - 本番サーバー向けの高スループット I/O ではなく、開発用スキャフォールド生成が用途である
 *
 * @param filePath 出力先のファイルパス
 * @param content 書き込むソースコード文字列
 * @param options.skipIfExists true の場合、既存ファイルは上書きせずスキップする
 */
export function writeFile(
  filePath: string,
  content: string,
  options?: { skipIfExists?: boolean },
) {
  // skipIfExists が有効かつファイルが存在する場合は早期 return
  if (options?.skipIfExists && fs.existsSync(filePath)) {
    console.log(`${filePath} は既に存在するためスキップしました`);
    return;
  }

  // 出力先ディレクトリが未作成なら mkdirSync で作成（ネストしたパスも一括作成）
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 生成完了を即座に console.log できるよう、書き込み完了まで同期的に待つ
  fs.writeFileSync(filePath, content);

  console.log(`${filePath} を作成しました`);
}
