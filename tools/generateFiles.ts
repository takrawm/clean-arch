/**
 * Clean Architecture の各層に対応するファイルを対話形式で生成する CLI スクリプト。
 * テンプレート関数でソースコード文字列を組み立て、writeFile で src-clean 配下に書き出す。
 */
import inquirer from "inquirer";
import path from "path";
import {
  generateController,
  generatePrismaRepository,
} from "./templates/adapterLayer";
import {
  generateEntity,
  generateRepositoryInterface,
} from "./templates/entityLayer";
import { generateRouter } from "./templates/infrastructureLayer";
import {
  generateRequestDto,
  generateResponseDto,
  generateUseCase,
  generateUseCaseInterface,
} from "./templates/useCaseLayer";
import { capitalize, lowercaseFirst, writeFile } from "./utils";

// 既存ファイルを上書きせずスキップする（誤生成による破壊的変更を防ぐ）
const writeOptions = { skipIfExists: true } as const;

/** Domain 層: エンティティとリポジトリインターフェースを生成する */
async function generateEntityLayer() {
  // 生成対象のエンティティ名をユーザーに入力させる
  const { entityName } = await inquirer.prompt([
    {
      type: "input",
      name: "entityName",
      message: "エンティティ名を入力してください",
    },
  ]);
  const basePath = path.join(__dirname, "..", "src-clean", "domain");

  // エンティティ本体（domain/entities/）を生成
  const entityContent = generateEntity(entityName);
  writeFile(
    path.join(basePath, "entities", `${lowercaseFirst(entityName)}.ts`),
    entityContent,
    writeOptions,
  );

  // 永続化の抽象（domain/repositories/）を生成。実装は Adapter 層が担う
  const repositoryInterfaceContent = generateRepositoryInterface(entityName);
  writeFile(
    path.join(
      basePath,
      "repositories",
      `${lowercaseFirst(entityName)}RepositoryInterface.ts`,
    ),
    repositoryInterfaceContent,
    writeOptions,
  );
}

/** Application 層: ユースケース・DTO をエンティティ単位のディレクトリに生成する */
async function generateUseCaseLayer() {
  // 紐づくエンティティと、作成するユースケース名を入力させる
  const { entityName, useCaseName } = await inquirer.prompt([
    {
      type: "input",
      name: "entityName",
      message: "エンティティ名を入力してください",
    },
    {
      type: "input",
      name: "useCaseName",
      message: "ユースケース名を入力してください",
    },
  ]);
  const basePath = path.join(__dirname, "..", "src-clean", "application");
  const entityDir = lowercaseFirst(entityName);
  const useCaseDir = lowercaseFirst(useCaseName);

  // ユースケースの契約（Controller が依存するインターフェース）
  writeFile(
    path.join(
      basePath,
      "useCases",
      entityDir,
      `${useCaseDir}UseCaseInterface.ts`,
    ),
    generateUseCaseInterface(entityName, useCaseName),
    writeOptions,
  );
  // ユースケース本体（ビジネスロジックの orchestration）
  writeFile(
    path.join(basePath, "useCases", entityDir, `${useCaseDir}UseCase.ts`),
    generateUseCase(entityName, useCaseName),
    writeOptions,
  );
  // リクエスト DTO（外部入力の型定義）
  writeFile(
    path.join(basePath, "dtos", entityDir, `${useCaseDir}RequestDto.ts`),
    generateRequestDto(useCaseName),
    writeOptions,
  );
  // レスポンス DTO（外部出力の型定義）
  writeFile(
    path.join(basePath, "dtos", entityDir, `${useCaseDir}ResponseDto.ts`),
    generateResponseDto(useCaseName),
    writeOptions,
  );
}

/** Interface Adapter 層: HTTP コントローラと Prisma リポジトリ実装を生成する */
async function generateInterfaceAdapterLayer() {
  // コントローラが呼び出すユースケースと、永続化対象のエンティティを入力させる
  const { entityName, useCaseName } = await inquirer.prompt([
    {
      type: "input",
      name: "entityName",
      message: "エンティティ名を入力してください",
    },
    {
      type: "input",
      name: "useCaseName",
      message: "ユースケース名を入力してください",
    },
  ]);
  const basePath = path.join(__dirname, "..", "src-clean", "adapter");

  // HTTP リクエストを受け取りユースケースへ委譲するコントローラ
  const controllerContent = generateController(entityName, useCaseName);
  writeFile(
    path.join(
      basePath,
      "controllers",
      `${lowercaseFirst(entityName)}Controller.ts`,
    ),
    controllerContent,
    writeOptions,
  );

  // Domain 層のリポジトリインターフェースを Prisma で実装するクラス
  const repositoryContent = generatePrismaRepository(entityName);
  writeFile(
    path.join(
      basePath,
      "repositories",
      `prisma${capitalize(entityName)}Repository.ts`,
    ),
    repositoryContent,
    writeOptions,
  );
}

/** Framework & Driver 層: Express ルータ（エンドポイント定義）を生成する */
async function generateInfrastructureLayer() {
  // ルーティング対象のエンティティ名を入力させる
  const { entityName } = await inquirer.prompt([
    {
      type: "input",
      name: "entityName",
      message: "エンティティ名を入力してください",
    },
  ]);
  const basePath = path.join(__dirname, "..", "src-clean", "infrastructure");

  // エンティティごとの HTTP ルートを定義するルータ
  const routerContent = generateRouter(entityName);
  writeFile(
    path.join(
      basePath,
      "web",
      "routers",
      `${lowercaseFirst(entityName)}Router.ts`,
    ),
    routerContent,
    writeOptions,
  );
}

/** エントリポイント: 生成する層を選択し、対応する生成処理を呼び出す */
async function main() {
  const layers = [
    "Entity",
    "UseCase",
    "InterfaceAdapter",
    "Framework&Driver",
  ] as const;
  // as const: 配列を readonly かつ各要素をリテラル型（"Entity" | "UseCase" | ...）として推論させる。
  // (typeof layers)[number]: 配列の各要素型のユニオン = Layer 型を定義する TypeScript のイディオム。
  type Layer = (typeof layers)[number];

  // inquirer.prompt: 対話型 CLI の質問を表示し、ユーザーの回答を Promise で返す。
  // { layer }: 返却オブジェクトから layer プロパティだけを分割代入で取り出す。
  // { layer: Layer }: 取り出した layer が Layer 型（choices のいずれか）であることを明示する。
  const { layer }: { layer: Layer } = await inquirer.prompt([
    {
      type: "select", // inquirer v9+ の単一選択プロンプト（旧 API の "list" 相当）
      name: "layer", // 回答が { layer: "Entity" } のように name をキーに格納される
      message: "どの層のファイルを生成しますか？",
      choices: layers, // 選択肢一覧（Layer 型の値のみ選べる）
    },
  ]);

  // 選択された層に応じて、対応する生成関数を実行する
  if (layer === "Entity") {
    await generateEntityLayer();
  } else if (layer === "UseCase") {
    await generateUseCaseLayer();
  } else if (layer === "InterfaceAdapter") {
    await generateInterfaceAdapterLayer();
  } else if (layer === "Framework&Driver") {
    await generateInfrastructureLayer();
  }
}

// スクリプト直接実行時に main を起動
main();
