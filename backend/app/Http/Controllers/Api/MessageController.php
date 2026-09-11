<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Throwable;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::latest()->get();

        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Save the message to the database
        $message = Message::create($validated);

        try {
            // Send the message to your portfolio Gmail
            Mail::raw(
                "You received a new message from your portfolio.\n\n" .
                "Name: {$message->name}\n" .
                "Email: {$message->email}\n" .
                "Subject: {$message->subject}\n\n" .
                "Message:\n{$message->message}\n\n" .
                "This message was submitted through your portfolio contact form.",
                function ($mail) use ($message) {
                    $mail->to(env('ADMIN_EMAIL'))
                        ->subject(
                            'New Portfolio Message - ' .
                            $message->subject
                        )
                        ->replyTo(
                            $message->email,
                            $message->name
                        );
                }
            );
        } catch (Throwable $e) {
            // The message is still saved in MySQL
            // even if the email cannot be sent.
            report($e);
        }

        return response()->json([
            'message' => 'Message sent successfully.',
            'data' => $message,
        ], 201);
    }

    public function show(Message $message)
    {
        return response()->json($message);
    }

    public function update(Request $request, Message $message)
    {
        $validated = $request->validate([
            'status' => 'required|in:unread,read',
        ]);

        $message->update($validated);

        return response()->json([
            'message' => 'Message status updated successfully.',
            'data' => $message,
        ]);
    }

    public function destroy(Message $message)
    {
        $message->delete();

        return response()->json([
            'message' => 'Message deleted successfully.',
        ]);
    }
}
