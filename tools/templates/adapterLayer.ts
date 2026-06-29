/**
 * Interface Adapter 層のコード生成テンプレート。
 * HTTP コントローラと Prisma リポジトリ実装のソース文字列を組み立てる。
 */
import { capitalize, lowercaseFirst } from "../utils";

/**
 * Express コントローラのソースコードを生成する。
 * リクエストを DTO に変換し、ユースケースへ委譲してレスポンスを返す骨格を出力する。
 * @param entityName エンティティ名（コントローラのクラス名・ファイル名に使用）
 * @param useCaseName ユースケース名（依存する UseCase インターフェース・ハンドラメソッド名に使用）
 */
export function generateController(entityName: string, useCaseName: string) {
  // ディレクトリ名・変数名は先頭小文字（camelCase）に統一
  const entityDir = lowercaseFirst(entityName);
  const useCaseDir = lowercaseFirst(useCaseName);

  const content = `
import { Request, Response } from "express";
import { ${capitalize(
    useCaseName,
  )}UseCaseInterface } from "../../application/useCases/${entityDir}/${useCaseDir}UseCaseInterface";
import { ${capitalize(
    useCaseName,
  )}RequestDto } from "../../application/dtos/${entityDir}/${useCaseDir}RequestDto";

export class ${capitalize(entityName)}Controller {
  constructor(
    private readonly ${useCaseDir}UseCase: ${capitalize(
      useCaseName,
    )}UseCaseInterface,
    // Add other useCase properties as needed
  ) {}

  async ${useCaseDir}(req: Request, res: Response): Promise<void> {
    try {
      const requestDto: ${capitalize(useCaseName)}RequestDto = {};
      const ${entityDir} = await this.${useCaseDir}UseCase.execute(requestDto);

      // Add response status code
      res.status().json(${entityDir});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "" });
    }
  }
}
`;
  return content.trim() + "\n";
}

/**
 * Prisma によるリポジトリ実装のソースコードを生成する。
 * Domain 層の RepositoryInterface を implements し、PrismaClient で DB 操作を行う。
 * @param entityName エンティティ名（Prisma モデル名・ドメイン型との対応に使用）
 */
export function generatePrismaRepository(entityName: string) {
  // クラス名（PascalCase）とファイル名・変数名（camelCase）を分けて保持
  const capitalEntityName = capitalize(entityName);
  const lowercaseEntityName = lowercaseFirst(entityName);

  const repositoryInterfaceClassName = `${capitalEntityName}RepositoryInterface`;
  const repositoryInterfaceFileName = `${lowercaseEntityName}RepositoryInterface`;

  const repositoryClassName = `Prisma${capitalEntityName}Repository`;

  const content = `
import { PrismaClient } from "../../../src-layered/generated/prisma";
import { ${capitalEntityName} } from "../../domain/entities/${lowercaseEntityName}";
import { ${repositoryInterfaceClassName} } from "../../domain/repositories/${repositoryInterfaceFileName}";

export class ${repositoryClassName} implements ${repositoryInterfaceClassName} {
  constructor(private readonly prisma: PrismaClient) {}

  async create(${lowercaseEntityName}: ${capitalEntityName}): Promise<${capitalEntityName}> {
    const created${capitalEntityName} = await this.prisma.${lowercaseEntityName}.create({
      data: {
        // Add properties
      },
    });

    return new ${capitalEntityName}(
      // Add properties
    );
  }

  async findById(id: string): Promise<${capitalEntityName} | null> {
    const found${capitalEntityName} = await this.prisma.${lowercaseEntityName}.findUnique({
      where: { id },
    });

    if (!found${capitalEntityName}) return null;

    return new ${capitalEntityName}(
      // Add properties
    );
  }
}
`;
  return content.trim() + "\n";
}
