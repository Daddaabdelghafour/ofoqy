<?php
namespace Database\Seeders;


use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;


class AdminSeeder extends Seeder
{
    public function run()
    {
        Admin::create([
            'nom_complet' => 'ofoqy',
            'email' => 'ofoqy@gmail.com',
            'password' => Hash::make('adminofoqy'), // Change to a secure password
        ]);
    }
}