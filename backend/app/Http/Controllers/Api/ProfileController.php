<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($request->hasFile('profile_photo')) {

            if ($user->profile_photo) {
                Storage::disk('public')->delete(
                    $user->profile_photo
                );
            }

            $validated['profile_photo'] = $request
                ->file('profile_photo')
                ->store('profile-photos', 'public');
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profile information updated successfully.',
            'user' => $user,
        ]);
    }

    public function showPublic()
    {
        $user = User::where('email', 'mazterjessanborja@gmail.com')
            ->where('role', 'admin')
            ->firstOrFail();

        return response()->json([
            'name' => $user->name,
            'profile_photo' => $user->profile_photo,
            'profile_photo_url' => $user->profile_photo
                ? asset('storage/' . $user->profile_photo)
                : null,
        ]);
    }
}
