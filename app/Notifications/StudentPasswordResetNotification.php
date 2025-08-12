<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Log;

class StudentPasswordResetNotification extends ResetPassword
{
    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Build the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        // Construire l'URL de réinitialisation
        $url = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        return $this->buildStyledEmail($notifiable, $url);
    }

    /**
     * Build the styled email with Ofoqy branding
     */

    private function buildStyledEmail($notifiable, $url): MailMessage
    {
        $logoUrl = asset('/images/Logo.png');

        return (new MailMessage)
            ->subject('🔐 Réinitialisation de votre mot de passe - Ofoqy')
            ->greeting('Bonjour ' . $notifiable->nom_complet . ' !')
            ->line('Vous recevez cet email car nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.')
            ->line('')
            ->line('**📋 Détails de la demande :**')
            ->line('• **Email :** ' . $notifiable->email)
            ->line('• **Date :** ' . now()->format('d/m/Y à H:i'))
            ->line('• **IP :** ' . request()->ip())
            ->line('')
            ->action('🔑 Réinitialiser mon mot de passe', $url)
            ->line('')
            ->line('**⚠️ Informations importantes :**')
            ->line('• Ce lien expire dans **60 minutes**')
            ->line('• Il ne peut être utilisé qu\'**une seule fois**')
            ->line('• Si vous n\'avez pas fait cette demande, ignorez cet email')
            ->line('')
            ->line('**🔗 Lien complet :**')
            ->line($url)
            ->salutation('Cordialement, L\'équipe Ofoqy 🎓')
            ->with([
                'logoUrl' => $logoUrl,
            ]);
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable): array
    {
        return [
            'token' => substr($this->token, 0, 10) . '...',
            'email' => $notifiable->email,
            'created_at' => now(),
        ];
    }
}