import { createPermission } from '@backstage/plugin-permission-common';

/*
    Envs permissions
*/
export const manegementConfigsEnvsReadPermission = createPermission({
    name: 'manegementconfigs.envs.read',
    attributes: { action: 'read' },
});

export const manegementConfigsEnvsCreatePermission = createPermission({
    name: 'manegementconfigs.envs.create',
    attributes: { action: 'create' },
});

export const manegementConfigsEnvsDeletePermission = createPermission({
    name: 'manegementconfigs.envs.delete',
    attributes: { action: 'delete' },
});

/*
    Feature-flags permissions
*/
export const manegementConfigsFeatureFlagReadPermission = createPermission({
    name: 'manegementconfigs.featureflag.read',
    attributes: { action: 'read' },
});

export const manegementConfigsFeatureFlagCreatePermission = createPermission({
    name: 'manegementconfigs.featureflag.create',
    attributes: { action: 'create' },
});

export const manegementConfigsFeatureFlagDeletePermission = createPermission({
    name: 'manegementconfigs.featureflag.delete',
    attributes: { action: 'delete' },
});

/*
    Secrets permissions
*/
export const manegementConfigsSecretsReadPermission = createPermission({
    name: 'manegementconfigs.secrets.read',
    attributes: { action: 'read' },
});

export const manegementConfigsSecretsShowValuePermission = createPermission({
    name: 'manegementconfigs.secrets.show',
    attributes: { action: 'read' },
});

export const manegementConfigsSecretsCreatePermission = createPermission({
    name: 'manegementconfigs.secrets.create',
    attributes: { action: 'create' },
});

export const manegementConfigsSecretsDeletePermission = createPermission({
    name: 'manegementconfigs.secrets.delete',
    attributes: { action: 'delete' },
});

export const manegementConfigsPermissions = [
    
    manegementConfigsEnvsReadPermission,
    manegementConfigsEnvsCreatePermission,
    manegementConfigsEnvsDeletePermission,

    manegementConfigsFeatureFlagReadPermission,
    manegementConfigsFeatureFlagCreatePermission,
    manegementConfigsFeatureFlagDeletePermission,

    manegementConfigsSecretsReadPermission,
    manegementConfigsSecretsShowValuePermission,
    manegementConfigsSecretsCreatePermission,
    manegementConfigsSecretsDeletePermission

];
