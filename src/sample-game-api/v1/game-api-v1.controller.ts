import { Body, Controller, Post } from '@nestjs/common';
import { GameApiHttpStatus } from '../../exception/exception';
import {
  CategoryReqDto,
  ConvertConfirmReqDto,
  GameGoodsReqDto,
  MintFinishedReqDto,
  MintReqDto,
  SearchAllReqDto,
  SearchReqDto,
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
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { nftStatus, categoryMintType } from '../../enum/common.enum';

@ApiBearerAuth()
@ApiTags('Sample Game API')
@Controller({
  version: '2',
})
export class GameApiV1Controller {
  constructor() {} // private readonly gameApiService: GameApiV2Service

  @Post('/servers')
  @ApiOperation({ summary: '게임 서버 정보 조회' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '게임 서버 목록 조회',
    type: GameServerResDto,
  })
  async findServers(): Promise<CommonResponseDto<any>> {
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

  @Post('/convert/goods-list')
  @ApiOperation({ summary: '재화 수량 정보 조회' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: GameGoodsResDto,
  })
  async findGoods(
    @Body() reqeust: SearchAllReqDto,
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

  @Post('/convert/confirm')
  @ApiOperation({ summary: '이용자의 재화가 convert 가능한 상태인지 확인' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: CommonResponseDto,
  })
  async convertConfirm(
    @Body() request: ConvertConfirmReqDto,
  ): Promise<CommonResponseDto<any>> {
    // 응답 정보 구성
    return new CommonResponseDto<any>(GameApiHttpStatus.OK, 'success');
  }

  @Post('/convert')
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

  @Post('/mint/character-list')
  @ApiOperation({ summary: '캐릭터 목록 조회' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: GameCharacterResDto,
  })
  async findCharacters(
      @Body() request: SearchReqDto,
  ): Promise<CommonResponseDto<any>> {
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

  @Post('/mint/item-list')
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
      @Body() request: CategoryReqDto,
  ): Promise<CommonResponseDto<any>> {
    let result = null;

    // ServerCharacterDto.categoryId 또는 ServerCharacterDto.categoryType 으로 구분하여 요청을 판단하여 응답.
    switch (request.categoryType) {
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

  @Post('/mint/confirm')
  @ApiOperation({ summary: 'Minting 가능 여부 확인' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: MintDataResDto,
  })
  async mintConfirm(
    @Body() request: MintReqDto,
  ): Promise<CommonResponseDto<any>> {
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
  @ApiOperation({ summary: '아이템 업데이트' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: MintDataResDto,
  })
  async mint(
      @Body() request: MintReqDto,
  ): Promise<CommonResponseDto<any>> {
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

  @Post('/lock')
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

  @Post('/unlock')
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
