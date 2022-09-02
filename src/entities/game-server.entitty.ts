import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class GameServerEntitty {
  id: number;

  @ApiProperty({ example: 'afkraid', description: 'game' })
  gold: string;

  @ApiProperty({ example: 100, description: 'lower game currency' })
  lowerGameCurrency: number;

  @ApiProperty({ example: 0, description: 'game token' })
  gameToken: number;

  @ApiProperty({ example: 100, description: 'upper game currency' })
  upperGameCurrency: number;

  @ApiProperty({ example: 0, description: 'c2x' })
  ctx: number;

  @ApiProperty({ example: '2022-07-06T19:04:04.739Z' })
  createdAt: string;

  @ApiProperty({ example: '2022-07-06T19:04:04.739Z' })
  updatedAt: string;
}

export class UserInfoEntitty {
  gold: string;
  gem: string;
}

export class GameCurrency {
  @ApiProperty({ example: 'afkraid', description: 'game code' })
  gameCode: string;
  @ApiProperty({ example: '0', description: 'upper game currency' })
  upperGameCurrencyAmount: string;
  @ApiProperty({ example: '0', description: 'lower game currency' })
  lowerGameCurrencyAmount: string;
}

export class Constraint {
  @ApiProperty({ example: 'afkraid', description: 'game code' })
  gameCode: string;
  @ApiProperty({ example: true, description: 'available status' })
  isValid: boolean;
}

export class ConvertingConstraint extends Constraint {
  @ApiProperty({ example: '10', description: 'available amount' })
  availableUpperGameCurrencyAmount: string;
  @ApiProperty({ example: '10', description: 'available amount' })
  availableLowerGameCurrencyAmount: string;
}

export class GameInfo {
  @ApiProperty({ example: 'afkraid', description: 'game code' })
  gameCode: string;
  @ApiProperty({ example: 'afkraid', description: 'game name' })
  gameName: string;
}

export class GameList {
  game: GameInfo[];
}
