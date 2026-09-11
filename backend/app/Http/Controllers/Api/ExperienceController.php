<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function index()
    {
        $experiences = Experience::orderByDesc('start_date')->get();

        return response()->json($experiences);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'position' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'required|boolean',
        ]);

        $experience = Experience::create($validated);

        return response()->json([
            'message' => 'Experience created successfully.',
            'experience' => $experience,
        ], 201);
    }

    public function show(Experience $experience)
    {
        return response()->json($experience);
    }

    public function update(Request $request, Experience $experience)
    {
        $validated = $request->validate([
            'position' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'required|boolean',
        ]);

        $experience->update($validated);

        return response()->json([
            'message' => 'Experience updated successfully.',
            'experience' => $experience,
        ]);
    }

    public function destroy(Experience $experience)
    {
        $experience->delete();

        return response()->json([
            'message' => 'Experience deleted successfully.',
        ]);
    }
}
