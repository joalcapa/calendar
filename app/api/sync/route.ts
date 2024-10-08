import { google } from 'googleapis';
import { getServerSession } from 'next-auth/next';
import CreateEventsFromGoogle from "../../../services/events/createEventsFromGoogle";

export async function POST(request: Request) {
    const { token } = await request.json();
    const session = await getServerSession();

    if (!session) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
        access_token: token,
    });

    try {
        const calendar = google.calendar('v3');
        const response = await calendar.events.list({
            auth: oauth2Client,
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const service = new CreateEventsFromGoogle(response.data.items);
        await service.call();

        return new Response({ message: "ok" }, { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}