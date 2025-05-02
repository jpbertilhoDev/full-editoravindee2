import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import path from "path";

// Limitar o tamanho do upload para 5MB - novo formato de configuração
export const runtime = 'nodejs'; // Usar Node.js para operações com arquivos
export const dynamic = 'force-dynamic'; // Esta rota não pode ser estática

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo foi enviado" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name;

    // Garantir que o diretório existe
    const uploadsDir = path.join(process.cwd(), "public/avatars");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      console.log("Diretório já existe ou erro ao criar:", error);
    }

    // Salvar o arquivo
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      filename,
      url: `/avatars/${filename}`,
    });
  } catch (error) {
    console.error("Erro ao processar upload:", error);
    return NextResponse.json(
      { error: "Falha ao processar o upload" },
      { status: 500 }
    );
  }
}

// Remover a configuração antiga
// export const config = {
//   api: {
//     bodyParser: false,
//     responseLimit: "5mb",
//   },
// };
