<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\Message;
use App\Models\Project;
use App\Models\Skill;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'projects' => Project::count(),

            'skills' => Skill::count(),

            'experiences' => Experience::count(),

            'messages' => Message::count(),

            'unread_messages' => Message::where(
                'status',
                'unread'
            )->count(),

            'recent_messages' => Message::latest()
                ->take(5)
                ->get([
                    'id',
                    'name',
                    'email',
                    'subject',
                    'status',
                    'created_at',
                ]),

            'recent_projects' => Project::latest()
                ->take(5)
                ->get([
                    'id',
                    'title',
                    'status',
                    'created_at',
                ]),
        ]);
    }
}
