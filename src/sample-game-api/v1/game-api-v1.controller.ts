import {Body, Controller, Get, Headers, Patch, Post, Query} from '@nestjs/common';
import { GameApiException, GameApiHttpStatus } from '../../exception/exception';
import {
  GameGoodsReqDto,
  MintFinishedReqDto,
  MintReqDto,
} from './dto/game-api-v1.req.dto';
import {
  GameCharacterResDto,
  GameGoodsResDto,
  GameServerChannelResDto,
  GameServerResDto,
  MintDataResDto,
  MintResDto,
} from './dto/game-api-v1.res.dto';
import { CommonResponseDto } from '../../common/dto/common-response.dto';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation, ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { categoryMintType, nftStatus } from '../../enum/common.enum';

@ApiBearerAuth()
@ApiTags('Sample Game API')
// todo: appid는 모든 게임서버 API 기본 요청값? -> api 요청 시 게임 서버의 URL이 이미 고정되어 있음으로 게임서버에서는 appid를 전달 받지 않아도 무방 할 것 같으나, appid가 국가또는 플렛폼 정보를 포함하고 있기 때문에 게임에서 별도로 구분하여 분기 처리를 하고자 한다면 필수값이 될 것같습니다.
@ApiHeaders([
  {
    name: 'appid',
    description: 'App ID',
  },
])
@Controller({
  version: '2',
})
export class GameApiV1Controller {
  constructor() {} // private readonly gameApiService: GameApiV2Service

  @Get('/game/servers')
  @ApiOperation({ summary: '게임 서버 정보 조회' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '게임 서버 목록 조회',
    type: GameServerResDto,
  })
  async findServers(@Headers() headers): Promise<CommonResponseDto<any>> {
    const appid = headers['appid'] ?? false;
    if (!appid) {
      throw new GameApiException('no appid requested', '', GameApiHttpStatus.BAD_REQUEST);
    }
    const servers: GameServerResDto[] = [];

    servers.push(<GameServerResDto>{
      serverId: '1',
      serverName: '서버1',
      channels: [
        <GameServerChannelResDto>{
          channelName: '채널1',
          channelId: '1',
          channels: [
            <GameServerChannelResDto>{
              channelName: '채널1-1',
              channelId: '1',
            },
            <GameServerChannelResDto>{
              channelName: '채널1-2',
              channelId: '2',
            },
          ],
        },
        { channelName: '채널2', channelId: '2' },
      ],
    });

    servers.push(<GameServerResDto>{
      serverId: '2',
      serverName: '서버2',
    });

    servers.push(<GameServerResDto>{
      serverId: '3',
      serverName: '서버3',
    });

    // 응답 정보 구성
    return new CommonResponseDto<any>(GameApiHttpStatus.OK, 'success', servers);
  }

  @Get('/convert/goods')
  @ApiHeaders([
    {
      name: 'server', // todo: server 정보 입력? string ex> 1,1,1
      description: 'Server Information',
    },
    {
      name: 'pid',
      description: 'Player ID',
    },
  ])
  @ApiQuery({
    name: 'characterId',
    example: 'hulk',
    required: false,
  })
  @ApiOperation({ summary: '게임재화 수량 정보 조회' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: GameGoodsResDto,
  })
  async findGoods(
    // todo: characterId, pid 구분해서 입력 필요?
    @Query('characterId') characterId: string,
  ): Promise<CommonResponseDto<any>> {
    const goods: GameGoodsResDto[] = [];

    goods.push(
      <GameGoodsResDto>{
        goodsCode: 'goldcode',
        goodsName: 'gold',
        amount: 100,
        avalibleAmount: 10000,
      },
      <GameGoodsResDto>{
        goodsCode: 'crystalcode',
        goodsName: 'crystal',
        amount: 100,
        avalibleAmount: 100000,
      },
    );

    // 응답 정보 구성
    return new CommonResponseDto<any>(GameApiHttpStatus.OK, 'success', goods);
  }

  @Get('/convert/confirm')
  @ApiHeaders([
    {
      name: 'server',
      description: 'Server Information',
    },
    {
      name: 'pid',
      description: 'Player ID',
    },
  ])
  @ApiQuery({
    name: 'characterId',
    example: 'hulk',
    required: false,
  })
  @ApiOperation({ summary: '유저의 재화가 convert 가능한 상태인지 확인' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: CommonResponseDto,
  })
  async convertConfirm(
    @Query('characterId') characterId: string,
    @Query('type') type: string, // 교환 타입
    @Query('goodsCode') goodsCode: string, // 재화 구분
    @Query('goodsAmount') goods: string,
    @Query('tokenId') tokenId: string, // 토큰 구분
    @Query('tokenAmount') tokenAmount: string,
  ): Promise<CommonResponseDto<any>> {
    // 응답 정보 구성
    return new CommonResponseDto<any>(GameApiHttpStatus.OK, 'success');
  }

  @Patch('/convert')
  @ApiHeaders([
    {
      name: 'server',
      description: 'Server Information',
    },
    {
      name: 'pid',
      description: 'Player ID',
    },
  ])
  @ApiOperation({ summary: '유저 재화 변경' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: GameGoodsResDto,
  })
  async updateGoods(
    @Body() request: GameGoodsReqDto,
  ): Promise<CommonResponseDto<any>> {
    // 차감 후 변화 금액
    const goods: GameGoodsResDto = <GameGoodsResDto>{
      goodsCode: 'goldcode',
      goodsName: 'gold',
      amount: 100,
    };
    // 응답 정보 구성
    return new CommonResponseDto<any>(GameApiHttpStatus.OK, 'success', goods);
  }

  @Get('/mint/characters')
  @ApiHeaders([
    {
      name: 'server',
      description: 'Server Information',
    },
    {
      name: 'pid',
      description: 'Player ID',
    },
  ])
  @ApiOperation({ summary: '캐릭터 목록 조회' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: GameCharacterResDto,
  })
  async findCharacters(): Promise<CommonResponseDto<any>> {
    const characters: GameCharacterResDto[] = [];

    characters.push(
      <GameCharacterResDto>{
        characterName: '캐릭터명(닉네임)1',
        characterId: '1',
      },
      <GameCharacterResDto>{
        characterName: '캐릭터명(닉네임)2',
        characterId: '2',
      },
    );

    // 응답 정보 구성
    return new CommonResponseDto<any>(
      GameApiHttpStatus.OK,
      'success',
      characters,
    );
  }

  @Get('/mint/items')
  @ApiHeaders([
    {
      name: 'server',
      description: 'Server Information',
    },
    {
      name: 'pid',
      description: 'Player ID',
    },
  ])
  @ApiQuery({
    name: 'characterId',
    example: 'hulk',
    required: false,
  })
  @ApiOperation({
    summary: '카테고리별 민팅 가능 목록 조회',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: MintResDto,
  })
  async findMint(
    @Query('characterId') characterId: string,
    @Query('categoryId') categoryId: string,
    // todo: categoryType 필요? -> 필수는 아니나 되도록 게임서버 쪽에 가능한 많은 정보를 주는 것이 좋을 것 같아서 추가 하였습니다.
    @Query('categoryType') categoryType: number,
  ): Promise<CommonResponseDto<any>> {
    let result = null;

    // ServerCharacterDto.categoryId 또는 ServerCharacterDto.categoryType 으로 구분하여 요청을 판단하여 응답.
    switch (Number(categoryType)) {
      // 단일 민팅
      case categoryMintType.minting:
        result = [];
        result.push(
          <MintResDto>{
            name: 'sword1',
            description: 'sword1 description',
            uniqueId: 'itemUniqCode1',
            nftStatus: nftStatus.nonNFT,
            tokenId: null,
          },
          <MintResDto>{
            name: 'sword2',
            description: 'sword1 description',
            uniqueId: 'itemUniqCode2',
            nftStatus: nftStatus.unLockedNFT,
            tokenId: 'tokenId',
          },
        );

        break;
      // 조합 민팅
      case categoryMintType.mixMintig:
        result = [];
        result.push(
          <MintResDto>{
            name: 'sword1',
            description: 'sword1 description',
            uniqueId: 'itemUniqCode1',
            nftStatus: nftStatus.nonNFT,
            breedCount: 0,
            tokenId: null,
          },
          <MintResDto>{
            name: 'sword2',
            description: 'sword2 description',
            uniqueId: 'itemUniqCode2',
            nftStatus: nftStatus.unLockedNFT,
            breedCount: 4,
            tokenId: 'tokenId',
          },
          <MintResDto>{
            name: 'sword3',
            description: 'sword3 description',
            uniqueId: 'itemUniqCode3',
            nftStatus: nftStatus.LockedNFT,
            breedCount: 2,
            tokenId: 'tokenId',
          },
        );

        break;
    }

    // 응답 정보 구성
    return new CommonResponseDto<any>(GameApiHttpStatus.OK, 'success', result);
  }

  @Get('/mint/confirm')
  @ApiHeaders([
    {
      name: 'server',
      description: 'Server Information',
    },
    {
      name: 'pid',
      description: 'Player ID',
    },
  ])
  @ApiQuery({
    name: 'characterId',
    example: 'hulk',
    required: false,
  })
  @ApiOperation({ summary: 'Minting 가능 여부 확인' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: MintDataResDto,
  })
  async mintConfirm(
    @Query('characterId') characterId: string,
    // todo: category type 확인 필요? -> 게임서버에 요청 시, 되도록 많은 정보를 전달하고 싶어 추가 한 사항입니다. 필수는 아닐것 같습니다.
    @Query('type') type: string,
    @Query('items') items: string,
    @Query('tokenId') tokenId: string,
  ): // @Body() request: MintReqDto,
  Promise<CommonResponseDto<any>> {
    // 응답데이터 구성
    const result = <MintDataResDto>{
      uniqueId: 'MintuniqCode1',
      extension: {
        name: "Arbiter's Robe",
        description: 'desc',
        image: 'https://image01.c2x.world/equip_92053030.gif',
        animation_url: 'https://image01.c2x.world/equip_92053030.gif',
        youtube_url: '',
        image_data: '',
        external_url: 'https://dex.c2xnft.com/market?key=4423',
        background_color: '',
        attributes: [
          {
            trait_type: 'Category',
            max_value: '',
            value: 'Game',
            display_type: '',
          },
        ],
      },
    };

    // 응답 정보 구성
    return new CommonResponseDto<any>(GameApiHttpStatus.OK, 'success', result);
  }

  @Post('/mint')
  @ApiHeaders([
    {
      name: 'server',
      description: 'Server Information',
    },
    {
      name: 'pid',
      description: 'Player ID',
    },
  ])
  @ApiOperation({ summary: '아이템 업데이트' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: MintDataResDto,
  })
  async mint(@Body() request: MintReqDto): Promise<CommonResponseDto<any>> {
    // 응답데이터 구성
    const result = <MintDataResDto>{
      uniqueId: 'MintuniqCode1',
      extension: {
        name: "Arbiter's Robe",
        description: 'desc',
        image: 'https://image01.c2x.world/equip_92053030.gif',
        animation_url: 'https://image01.c2x.world/equip_92053030.gif',
        youtube_url: '',
        image_data: '',
        external_url: 'https://dex.c2xnft.com/market?key=4423',
        background_color: '',
        attributes: [
          {
            trait_type: 'Category',
            max_value: '',
            value: 'Game',
            display_type: '',
          },
        ],
      },
    };

    // 응답 정보 구성
    return new CommonResponseDto<any>(GameApiHttpStatus.OK, 'success', result);
  }

  @Patch('/lock')
  @ApiHeaders([
    {
      name: 'server',
      description: 'Server Information',
    },
    {
      name: 'pid',
      description: 'Player ID',
    },
  ])
  @ApiOperation({ summary: '게임내 사용 불가 요청' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: CommonResponseDto,
  })
  async lock(@Body() request: MintReqDto): Promise<CommonResponseDto<any>> {
    // 응답 정보 구성
    return new CommonResponseDto<any>(GameApiHttpStatus.OK, 'success');
  }

  @Patch('/unlock')
  @ApiHeaders([
    {
      name: 'server',
      description: 'Server Information',
    },
    {
      name: 'pid',
      description: 'Player ID',
    },
  ])
  @ApiOperation({ summary: '게임내 사용 가능 요청' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: CommonResponseDto,
  })
  async unlock(@Body() request: MintReqDto): Promise<CommonResponseDto<any>> {
    // 응답 정보 구성
    return new CommonResponseDto<any>(GameApiHttpStatus.OK, 'success');
  }

  @Post('/tx/result')
  @ApiHeaders([
    {
      name: 'server',
      description: 'Server Information',
    },
    {
      name: 'pid',
      description: 'Player ID',
    },
  ])
  @ApiOperation({ summary: 'Minting 결과 전송' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: CommonResponseDto,
  })
  async mintFinished(
    @Body() request: MintFinishedReqDto,
  ): Promise<CommonResponseDto<any>> {
    // 응답 정보 구성
    return new CommonResponseDto<any>(GameApiHttpStatus.OK, 'success');
  }
}
