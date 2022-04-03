import { UnauthorizedException } from '@nestjs/common';
import { Authenticator, AuthLink } from 'beland-crypto';
import { NextFunction } from 'express';
const AUTH_CHAIN_HEADER_PREFIX = 'x-identity-auth-chain-';

function buildAuthChain(req: Request) {
  return Object.keys(req.headers)
    .filter((header) => header.includes(AUTH_CHAIN_HEADER_PREFIX))
    .sort((a, b) => (extractIndex(a) > extractIndex(b) ? 1 : -1))
    .map((header) => JSON.parse(req.headers[header] as string) as AuthLink);
}

function extractIndex(header: string) {
  return parseInt(header.substring(AUTH_CHAIN_HEADER_PREFIX.length), 10);
}

async function decodeAuthChain(req: any): Promise<string> {
  const authChain = buildAuthChain(req);
  let ethAddress: string | null = null;
  let errorMessage: string | null = null;

  if (authChain.length === 0) {
    errorMessage = `Invalid auth chain`;
  } else {
    ethAddress = authChain[0].payload;

    if (!ethAddress) {
      errorMessage = 'Missing ETH address in auth chain';
    } else {
      try {
        const endpoint = (
          req.method +
          ':' +
          req.baseUrl.replace('/v1', '')
        ).toLowerCase();
        console.log(req);
        const res = await Authenticator.validateSignature(
          endpoint,
          authChain,
          null as any,
          Date.now(),
        );

        if (!res.ok) {
          errorMessage = res.message;
        }
      } catch (error) {
        errorMessage = error.message;
      }
    }
  }

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return ethAddress.toLowerCase();
}

export async function authentication(
  req: any,
  _res: Response,
  next: NextFunction,
  isOptional: boolean,
) {
  try {
    const ethAddress = await decodeAuthChain(req);
    req.user = { id: ethAddress.toLocaleLowerCase() };
  } catch (error) {
    if (!isOptional) {
      throw new UnauthorizedException(error.message);
    }
  }
  next();
}
