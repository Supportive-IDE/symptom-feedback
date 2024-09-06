import { NextResponse } from "next/server";

export async function POST(req, res) {
    const data = await req.json();
    console.log(data);
    return NextResponse.json({}, {
        status: 200
    })
    //res.redirect(200, '/feedback/');
}