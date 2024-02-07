import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { NotAllowedError } from '@backstage/errors';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import { PermissionEvaluator, AuthorizeResult } from '@backstage/plugin-permission-common';
import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';
import { manegementConfigsPermissions, manegementConfigsEnvsCreatePermission, manegementConfigsSecretsShowValuePermission } from '@internal/plugin-management-configs-common';

export interface RouterOptions {
  logger: Logger;
  permissions: PermissionEvaluator;
}

const exampleScrets = [{"key":"APP-CONNECTION-STRING","createdOn":"2023-08-08T19:27:05.000Z","updatedOn":"2023-08-08T19:27:05.000Z"},{"key":"database","createdOn":"2023-08-07T18:58:52.000Z","updatedOn":"2023-08-07T18:58:52.000Z"},{"key":"event-hub-connection-string","createdOn":"2023-08-16T13:50:17.000Z","updatedOn":"2023-08-16T13:50:17.000Z"},{"key":"event-hub-namespace","createdOn":"2023-08-01T17:00:46.000Z","updatedOn":"2023-08-01T17:00:46.000Z"},{"key":"event-hub-token","createdOn":"2023-08-16T14:56:23.000Z","updatedOn":"2023-08-16T14:56:23.000Z"},{"key":"redis","createdOn":"2023-08-01T12:19:25.000Z","updatedOn":"2023-08-01T12:19:25.000Z"},{"key":"sessionmanager","createdOn":"2023-08-15T18:27:26.000Z","updatedOn":"2023-08-15T18:27:26.000Z"},{"key":"storage-connection-string","createdOn":"2023-08-01T12:28:38.000Z","updatedOn":"2023-08-01T12:28:38.000Z"},{"key":"storage-name","createdOn":"2023-08-01T12:28:38.000Z","updatedOn":"2023-08-01T12:28:38.000Z"}];

const exampleEnv = [{"key":"contact-phone","updatedOn":"2023-08-17T15:58:14.000Z", "type": 'env', "value": "(00) 1234-1234" }, {"key":"contact-emails","createdOn":"2023-08-17T15:58:14.000Z","updatedOn":"2023-08-17T15:58:14.000Z", "type": 'env', "value": "[{ name: 'João', email: 'joao@support.com'}, { name: 'Maria', email: 'maria@support.com'}]" }];

const exampleFeatureFlag = [{"key":"ft-user-forgot-password","updatedOn":"2023-08-17T15:58:14.000Z", "type": 'featureflag', "value": true }, {"key":"rt-delivery","createdOn":"2023-08-17T15:58:14.000Z","updatedOn":"2023-08-17T15:58:14.000Z", "type": 'featureflag', "value": false }];

/** Backend mocked */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, permissions } = options;

  const permissionIntegrationRouter = createPermissionIntegrationRouter({
    permissions: manegementConfigsPermissions,
  });

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.use(permissionIntegrationRouter);

  router.get('/:namespace/:name', (req, response) => {
    if (req.query.type === 'env') return response.json(exampleEnv);
    if (req.query.type === 'featureflag') return response.json(exampleFeatureFlag);
    return response.json(exampleScrets);
  });

  router.get('/:namespace/:name/:key/value', async (req, response) => {

    const token = getBearerTokenFromAuthorizationHeader(req.header('authorization'));

    const decision = (
      await permissions.authorize([{ permission: manegementConfigsSecretsShowValuePermission }], {
        token,
      })
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    response.status(200).send('secret value');
  });

  router.put('/:namespace/:name', async (req, response) => {

    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );
    
    const decision = (
      await permissions.authorize([{ permission: manegementConfigsEnvsCreatePermission }], {
        token,
      })
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    response.status(200).json({ message: 'sucess' });
  });

  router.post('/:namespace/:name', async (req, response) => {

    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );
    
    const decision = (
      await permissions.authorize([{ permission: manegementConfigsEnvsCreatePermission }], {
        token,
      })
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    response.status(200).json({ message: 'sucess' });
  });

  router.delete('/:namespace/:name', async (req, response) => {

    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );
    
    const decision = (
      await permissions.authorize([{ permission: manegementConfigsEnvsCreatePermission }], {
        token,
      })
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    response.status(200).json({ message: 'sucess' });
  });

  router.use(errorHandler());
  return router;
}
