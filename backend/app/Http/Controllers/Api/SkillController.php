<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    /**
     * Display all skills.
     */
    public function index()
    {
        $skills = Skill::orderBy('category')
            ->orderBy('name')
            ->get();

        return response()->json($skills);
    }

    /**
     * Store a new skill.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'proficiency' => 'required|integer|min:0|max:100',
        ]);

        $skill = Skill::create($validated);

        return response()->json([
            'message' => 'Skill created successfully.',
            'skill' => $skill,
        ], 201);
    }

    /**
     * Display a specific skill.
     */
    public function show(Skill $skill)
    {
        return response()->json($skill);
    }

    /**
     * Update a skill.
     */
    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'proficiency' => 'required|integer|min:0|max:100',
        ]);

        $skill->update($validated);

        return response()->json([
            'message' => 'Skill updated successfully.',
            'skill' => $skill,
        ]);
    }

    /**
     * Delete a skill.
     */
    public function destroy(Skill $skill)
    {
        $skill->delete();

        return response()->json([
            'message' => 'Skill deleted successfully.',
        ]);
    }
}
