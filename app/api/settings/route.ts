import { NextResponse } from 'next/server';
import dbConnect from '@/infrastructure/database/mongoose';
import SettingsModel from '@/infrastructure/models/SettingsModel';

export async function GET() {
    try {
        await dbConnect();
        let settings = await SettingsModel.findOne();
        if (!settings) {
            settings = await SettingsModel.create({ advisors: [] });
        }
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching settings' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        console.log('UPDATING SETTINGS:', data);

        let settings = await SettingsModel.findOne();
        if (!settings) {
            console.log('CREATING NEW SETTINGS DOC');
            settings = new SettingsModel(data);
        } else {
            console.log('UPDATING EXISTING SETTINGS DOC');
            if (data.advisors) settings.advisors = data.advisors;
        }

        const saved = await settings.save();
        console.log('SAVED SETTINGS:', saved);
        return NextResponse.json(saved);
    } catch (error) {
        console.error('ERROR UPDATING SETTINGS:', error);
        return NextResponse.json({ error: 'Error updating settings' }, { status: 500 });
    }
}
