import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validMimeTypes.includes(file.type)) {
        return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const originalFileName = file.name;

    const myDate = new Date();
    const pad = (n) => (n < 10 ? '0' + n : n);
    const y = myDate.getFullYear();
    const m = pad(myDate.getMonth() + 1);
    const d = pad(myDate.getDate());
    const h = pad(myDate.getHours());
    const mi = pad(myDate.getMinutes());
    const s = pad(myDate.getSeconds());
    const ms = myDate.getMilliseconds().toString().padStart(3, '0'); // เติมศูนย์ด้านหน้าให้ครบ 3 หลัก

    const arrFileName = originalFileName.split('.');
    const ext = arrFileName[arrFileName.length - 1];
    const newFileName = `${y}${m}${d}${h}${mi}${s}${ms}.${ext}`;

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, newFileName);

    try {
        await writeFile(filePath, Buffer.from(buffer));
        return NextResponse.json({ newName: newFileName }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
