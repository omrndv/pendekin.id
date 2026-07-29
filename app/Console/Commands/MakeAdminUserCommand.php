<?php

namespace App\Console\Commands;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class MakeAdminUserCommand extends Command
{
    protected $signature = 'user:make-admin {email : Email address of the user to promote or create}';

    protected $description = 'Promote an existing user to Administrator or create a new Admin user in production.';

    public function handle(): int
    {
        $email = strtolower(trim($this->argument('email')));

        $user = User::where('email', $email)->first();

        if ($user) {
            $user->update(['role' => UserRole::ADMIN]);
            $this->info("User '{$email}' has been successfully promoted to Administrator!");

            return Command::SUCCESS;
        }

        // User does not exist -> create new Admin
        $name = $this->ask('Enter full name for new Admin user', 'Admin Pendekin');
        $password = $this->secret('Enter secure password');

        if (empty($password)) {
            $this->error('Password cannot be empty.');

            return Command::FAILURE;
        }

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => UserRole::ADMIN,
            'email_verified_at' => now(),
        ]);

        $this->info("New Administrator '{$email}' has been successfully created!");

        return Command::SUCCESS;
    }
}
