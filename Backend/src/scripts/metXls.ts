import * as XLSX from 'xlsx';
import * as path from 'path';
import { Activity } from '../models/Activity';

export const importActivityData = async () => {
    try {
        const filePath = path.resolve(__dirname, '../../uploads/MET-values.xlsx');
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(sheet);

        const mappedData = rawData.map((item: any) => ({
            activityName: item['ACTIVITY'] || item['activityName'],
            specificMotion: item['SPECIFIC MOTION'] || item['specificMotion'],
            metValue: item['METs'] || item['metValue']
        })).filter(item => item.activityName && item.specificMotion && item.metValue);

        if (mappedData.length === 0) {
            throw new Error('No valid activity data found to import.');
        }

        await Activity.deleteMany();
        await Activity.insertMany(mappedData);

        console.log("✅ Activity data imported successfully");
    } catch (error) {
        console.error("❌ Failed to import activity data:", error);
    }
};
