<?php
// filepath: app/Exceptions/ScrappingException.php

namespace App\Exceptions;

use Exception;

/**
 * Exception personnalisée pour erreurs de scrapping
 */
class ScrappingException extends Exception
{
    protected string $errorType;
    protected string $source;
    protected array $context;

    public function __construct(
        string $message = "",
        string $errorType = 'general',
        string $source = 'unknown',
        array $context = [],
        int $code = 0,
        ?Exception $previous = null
    ) {
        parent::__construct($message, $code, $previous);

        $this->errorType = $errorType;
        $this->source = $source;
        $this->context = $context;
    }

    // TODO: Getters pour informations additionnelles
    public function getErrorType(): string
    {
        return $this->errorType;
    }

    public function getSource(): string
    {
        return $this->source;
    }

    public function getContext(): array
    {
        return $this->context;
    }

    // TODO: Méthode pour logging formaté
    public function getLogContext(): array
    {
        return [
            'error_type' => $this->errorType,
            'source' => $this->source,
            'message' => $this->getMessage(),
            'context' => $this->context,
            'file' => $this->getFile(),
            'line' => $this->getLine()
        ];
    }
}