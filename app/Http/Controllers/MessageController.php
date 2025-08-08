<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Message;
use App\Models\Dialog;
use App\Models\User;
use App\Events\MessageSent;

class MessageController extends Controller
{
    public function index() {
        $authId = auth()->id();

        
        $dialog = Dialog::with([
            'userOne:id,name,avatar', 
            'userTwo:id,name,avatar'
        ])
        ->withCount(['messages as unread_messages' => function ($query) use ($authId) {
            $query->where('is_read', false)
                ->where('sender_id', '!=', $authId);
        }])
        ->where(function($query) use ($authId) {
            $query->where('user_one_id', $authId)
                ->orWhere('user_two_id', $authId);
        })
        ->latest()
        ->get();

        return Inertia::render('Message', [
            'dialog' => $dialog
        ]);
    }

    public function sender(Request $request) {
   
        $data = $request->validate([
            'dialog_id' => 'nullable',
            'message' => 'required|string|min:1|max:1000',
            'from_user_id' => 'required|exists:users,id',
            'to_user_id' => 'required|exists:users,id'
        ]);

        $dialog = null;

        if (!empty($data['dialog_id'])) {
            $dialog = Dialog::find($data['dialog_id']);
        }

        if (!$dialog) {
            $dialog = Dialog::where(function ($query) use ($data) {
                $query->where('user_one_id', auth()->id())
                    ->where('user_two_id', $data['to_user_id']);
            })
            ->orWhere(function ($query) use ($data) {
                $query->where('user_one_id', $data['to_user_id'])
                    ->where('user_two_id', auth()->id());
            })
            ->first();

            if (!$dialog) {
                $dialog =Dialog::create([
                    'user_one_id' => auth()->id(),
                    'user_two_id' => $data['to_user_id'],
                    'last_message' => $data['message'],
                ]);
            } else {
                $dialog->last_message = $data['message'];
                $dialog->save();
            }
        } else {
            $dialog->last_message = $data['message'];
            $dialog->save();
        }

        $message = Message::create([
            'dialog_id' => $dialog->id,
            'sender_id' => auth()->id(),
            'body' => $data['message'],
        ]);
    
        event(new MessageSent($message, $data['to_user_id']));
        return response()->json([
            'success' => true,
            'message' => $message
        ]);
    }

    public function load(Request $request, $id) {

        $dialog = Dialog::where(function ($query) {
            $query->where('user_one_id', auth()->id())
                ->orWhere('user_two_id', auth()->id());
        })->findOrFail($id);

        Message::where('dialog_id', $id)
            ->where('sender_id', '!=', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = Message::where('dialog_id', $id)
            ->with('sender:id,name,avatar')
            ->orderBy('created_at', 'asc')
            ->get();
        
        return response()->json([
            'messages' => $messages
        ]);
    }

    public function unreadSummary() {
        $authId = auth()->id();

        $dialogs = Dialog::withCount(['messages as unread_count' => function ($query) use ($authId) {
            $query->where('is_read', false)
                ->where('sender_id', '!=', $authId);
        }])
        ->where(function ($q) use ($authId) {
            $q->where('user_one_id', $authId)
            ->orWhere('user_two_id', $authId);
        })
        ->get(['id']);

        return response()->json([
            // 'dialogs' => $dialogs,
            'total_unread' => $dialogs->sum('unread_count'),
        ]);
    }
}
