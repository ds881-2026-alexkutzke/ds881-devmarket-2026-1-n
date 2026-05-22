export function isValidCep(cep: string): boolean {
    const entrada = cep.replace(/-/g, '');
    
    if (entrada.length === 8 && !isNaN(Number(entrada))) {
        return true;
    }

    return false;
}
