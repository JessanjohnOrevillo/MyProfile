<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            [
                'email' => 'mazterjessanborja@gmail.com',
            ],
            [
                'name' => 'Portfolio Admin',
                'password' => Hash::make('jessanjohnB2002'),
                'role' => 'admin',
            ]
        );
    }
}
