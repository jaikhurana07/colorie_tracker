import * as XLSX from 'xlsx';
import { Food } from '../models/Food';
import path from 'path';

export const importFoodData = async () => {
    try {
        const filePath = path.resolve(__dirname, '../../uploads/food-calories.xlsx');
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(sheet);

        const mappedData = rawData.map((item: any) => ({
            name: item['name'] || item['name'],
            serving: item['Serving Description 1 (g)'] || item['serving'],
            calories: item['Calories'] || item['calories'],
            foodGroup: item['Food Group'] || item['foodGroup']
        })).filter(item => item.name && item.serving && item.calories);

        if (mappedData.length === 0) {
            throw new Error('No valid food data found to import.');
        }

        await Food.deleteMany();
        await Food.insertMany(mappedData);

        console.log("✅ Food data imported successfully");
    } catch (error) {
        console.error("❌ Failed to import food data:", error);
    }
};
