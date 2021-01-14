<?php

/**
 * Get constant from the instance of a class
 */
class Mango{
    public const STATE = 'Pulp';
}

$class = new Mango;
$const = 'STATE';

echo (new ReflectionClass($class))->getConstant($const); // Pulp