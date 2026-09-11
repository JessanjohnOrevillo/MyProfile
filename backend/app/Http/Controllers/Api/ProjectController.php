<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Public Projects
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $projects = Project::with('skills')
            ->where('status', 'published')
            ->latest()
            ->get();

        return response()->json($projects);
    }

    /*
    |--------------------------------------------------------------------------
    | Admin Projects
    |--------------------------------------------------------------------------
    */

    public function adminIndex()
    {
        $projects = Project::with('skills')
            ->latest()
            ->get();

        return response()->json($projects);
    }

    /*
    |--------------------------------------------------------------------------
    | Create Project
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:projects,slug',
            'description' => 'required|string',

            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',

            'github_url' => 'nullable|url|max:255',
            'demo_url' => 'nullable|url|max:255',

            'status' => 'required|in:draft,published',

            'skills' => 'nullable|array',
            'skills.*' => 'exists:skills,id',
        ]);

        $skillIds = $validated['skills'] ?? [];

        unset($validated['skills']);

        /*
        |--------------------------------------------------------------------------
        | Upload Project Image
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('image')) {
            $validated['image'] = $request
                ->file('image')
                ->store('projects', 'public');
        }

        /*
        |--------------------------------------------------------------------------
        | Create Project
        |--------------------------------------------------------------------------
        */

        $project = Project::create($validated);

        /*
        |--------------------------------------------------------------------------
        | Attach Skills
        |--------------------------------------------------------------------------
        */

        $project->skills()->sync($skillIds);

        return response()->json([
            'message' => 'Project created successfully.',
            'project' => $project->load('skills'),
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | Show Project
    |--------------------------------------------------------------------------
    */

    public function show(Project $project)
    {
        return response()->json(
            $project->load('skills')
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Update Project
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:projects,slug,' . $project->id,
            'description' => 'required|string',

            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',

            'github_url' => 'nullable|url|max:255',
            'demo_url' => 'nullable|url|max:255',

            'status' => 'required|in:draft,published',

            'skills' => 'nullable|array',
            'skills.*' => 'exists:skills,id',
        ]);

        $skillIds = $validated['skills'] ?? [];

        unset($validated['skills']);

        /*
        |--------------------------------------------------------------------------
        | Replace Project Image
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('image')) {

            if ($project->image) {
                Storage::disk('public')->delete($project->image);
            }

            $validated['image'] = $request
                ->file('image')
                ->store('projects', 'public');
        }

        /*
        |--------------------------------------------------------------------------
        | Update Project
        |--------------------------------------------------------------------------
        */

        $project->update($validated);

        /*
        |--------------------------------------------------------------------------
        | Update Skills
        |--------------------------------------------------------------------------
        */

        $project->skills()->sync($skillIds);

        return response()->json([
            'message' => 'Project updated successfully.',
            'project' => $project->load('skills'),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Project
    |--------------------------------------------------------------------------
    */

    public function destroy(Project $project)
    {
        /*
        |--------------------------------------------------------------------------
        | Delete Project Image
        |--------------------------------------------------------------------------
        */

        if ($project->image) {
            Storage::disk('public')->delete($project->image);
        }

        /*
        |--------------------------------------------------------------------------
        | Delete Project
        |--------------------------------------------------------------------------
        */

        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully.',
        ]);
    }
}
