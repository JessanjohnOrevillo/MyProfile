<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $validated['email'])
            ->where('role', 'admin')
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'If the email belongs to an administrator, a password reset link will be sent.',
            ]);
        }

        $status = Password::sendResetLink([
            'email' => $user->email,
        ]);

        if ($status !== Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Unable to send the password reset email.',
            ], 500);
        }

        return response()->json([
            'message' => 'Password reset link sent successfully.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            [
                'email' => $validated['email'],
                'password' => $validated['password'],
                'password_confirmation' => $request->password_confirmation,
                'token' => $validated['token'],
            ],
            function (User $user, string $password) {
                if ($user->role !== 'admin') {
                    return;
                }

                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                $user->tokens()->delete();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [
                    __($status),
                ],
            ]);
        }

        return response()->json([
            'message' => 'Password reset successfully.',
        ]);
    }
}
