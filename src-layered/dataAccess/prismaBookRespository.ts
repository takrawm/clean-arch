// Prisma を使った Book テーブルへのデータアクセス層（Repository パターン）。
// businessLogic 層（BookService）から DB 操作の詳細を隠蔽する。

// Book: schema.prisma の Book モデルに対応する型
// PrismaClient: 生成された ORM クライアント（prisma generate で作成）
import { Book, PrismaClient } from "../generated/prisma";

export class PrismaBookRepository {
  // DB 接続・クエリ実行を担う Prisma クライアント
  private prisma: PrismaClient;

  constructor() {
    // .env の DATABASE_URL（file:./dev.db）を参照して SQLite に接続
    this.prisma = new PrismaClient();
  }

  // 新しい Book レコードを DB に INSERT する
  //
  // POST 系の処理なのに Promise<Book> を返す理由:
  // 1. HTTP POST もレスポンスボディを返せる（REST では 201 + 作成リソースが一般的）
  //    → BookController.add が res.status(201).json(book) でクライアントに返却する
  // 2. DB が自動生成した id / createdAt / updatedAt を呼び出し元に渡す必要がある
  //    （create 時に title しか渡していないが、返却時には全フィールドが揃っている）
  // 3. Promise<Book> の意味:
  //    - Promise … DB アクセスは非同期（async/await）
  //    - Book     … 解決後の値が作成済みレコードの型
  async create(title: string): Promise<Book> {
    // prisma.book.create() も INSERT 後のレコード全体を返す Prisma の仕様
    return await this.prisma.book.create({
      data: {
        title,
        isAvailable: true, // 新規登録時は常に貸出可能
        // id, createdAt, updatedAt は schema.prisma の @default により自動設定
      },
    });
  }

  // ID で Book を 1 件検索する
  // Promise<Book | null>: 見つからない場合は null を返す
  async findById(id: string): Promise<Book | null> {
    return await this.prisma.book.findUnique({
      where: {
        id, // 主キー（@id）による一意検索
      },
    });
  }
}
