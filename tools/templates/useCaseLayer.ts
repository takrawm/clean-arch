/**
 * Application 層のコード生成テンプレート。
 * ユースケース・DTO のソース文字列を組み立てる。
 */
import { capitalize, lowercaseFirst } from "../utils";

/**
 * ユースケースインターフェースのソースコードを生成する。
 * Controller は具象クラスではなくこのインターフェースに依存する（依存性逆転）。
 * @param entityName エンティティ名（DTO の import パスに使用）
 * @param useCaseName ユースケース名（インターフェース名・execute の入出力型に使用）
 */
export function generateUseCaseInterface(
  entityName: string,
  useCaseName: string,
) {
  const content = `
import { ${capitalize(
    useCaseName,
  )}RequestDto } from '../../dtos/${lowercaseFirst(
    entityName,
  )}/${lowercaseFirst(useCaseName)}RequestDto';
import { ${capitalize(
    useCaseName,
  )}ResponseDto } from '../../dtos/${lowercaseFirst(
    entityName,
  )}/${lowercaseFirst(useCaseName)}ResponseDto';

export interface ${capitalize(useCaseName)}UseCaseInterface {
  execute(requestDto: ${capitalize(useCaseName)}RequestDto): Promise<${capitalize(
    useCaseName,
  )}ResponseDto>;
}
`;
  return content.trim() + "\n";
}

/**
 * ユースケース本体のソースコードを生成する。
 * リポジトリインターフェース経由で Domain にアクセスする orchestration クラスの骨格を出力する。
 * @param entityName エンティティ名（リポジトリ・エンティティの import に使用）
 * @param useCaseName ユースケース名（クラス名・DTO 型に使用）
 */
export function generateUseCase(entityName: string, useCaseName: string) {
  const content = `
import { ${capitalize(
    entityName,
  )}RepositoryInterface } from '../../../domain/repositories/${lowercaseFirst(
    entityName,
  )}RepositoryInterface';
import { ${capitalize(
    entityName,
  )} } from '../../../domain/entities/${lowercaseFirst(entityName)}';
import { ${capitalize(
    useCaseName,
  )}RequestDto } from '../../dtos/${lowercaseFirst(
    entityName,
  )}/${lowercaseFirst(useCaseName)}RequestDto';
import { ${capitalize(
    useCaseName,
  )}ResponseDto } from '../../dtos/${lowercaseFirst(
    entityName,
  )}/${lowercaseFirst(useCaseName)}ResponseDto';
import { ${capitalize(useCaseName)}UseCaseInterface } from './${lowercaseFirst(
    useCaseName,
  )}UseCaseInterface';

export class ${capitalize(useCaseName)}UseCase implements ${capitalize(
    useCaseName,
  )}UseCaseInterface {
  constructor(private readonly ${lowercaseFirst(
    entityName,
  )}Repository: ${capitalize(entityName)}RepositoryInterface) {}

  async execute(requestDto: ${capitalize(
    useCaseName,
  )}RequestDto): Promise<${capitalize(useCaseName)}ResponseDto> {
    // Implement usecase logic
  }
}
`;
  return content.trim() + "\n";
}

/**
 * リクエスト DTO インターフェースのソースコードを生成する。
 * Controller から UseCase へ渡す入力データの型定義の骨格を出力する。
 * @param useCaseName ユースケース名（DTO インターフェース名に使用）
 */
export function generateRequestDto(useCaseName: string) {
  const content = `
export interface ${capitalize(useCaseName)}RequestDto {
  // Add properties for ${lowercaseFirst(useCaseName)} request
}
`;
  return content.trim() + "\n";
}

/**
 * レスポンス DTO インターフェースのソースコードを生成する。
 * UseCase から Controller へ返す出力データの型定義の骨格を出力する。
 * @param useCaseName ユースケース名（DTO インターフェース名に使用）
 */
export function generateResponseDto(useCaseName: string) {
  const content = `
export interface ${capitalize(useCaseName)}ResponseDto {
  // Add properties for ${lowercaseFirst(useCaseName)} response
}
`;
  return content.trim() + "\n";
}
