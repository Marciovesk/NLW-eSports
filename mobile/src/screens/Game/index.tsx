import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image, FlatList, Text } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'

import { Entypo } from '@expo/vector-icons';

import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { Heading } from '../../components/Heading';
import { Background } from '../../components/Background';

import logoImg from '../../assets/logo-nlw-esports.png'

import { styles } from './styles';

import { GameParams } from '../../@types/navigation';

import { THEME } from '../../theme';

import { DuoMatch } from '../../components/DuoMatch'


export function Game() {

  const [duos, setDuos] = useState<DuoCardProps[]>([]);
  const [discordDuoSelect, setDiscordDuoSelect] = useState('')

  const navigation = useNavigation()
  const route = useRoute();
  const game = route.params as GameParams;

  function handleGoBack() {
    navigation.goBack();
  }

  async function getDiscordUser(adsId: string){
    fetch(`http://192.168.0.25:3333/ads/${adsId}/discord`)
      .then(response => response.json())
      .then(data => setDiscordDuoSelect(data.discord));
  }

  useEffect(() => {
    fetch(`http://192.168.0.25:3333/games/${game.id}/ads`)
      .then(response => response.json())
      .then(data => setDuos(data));
  }, [])

  return (
    <Background >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo 
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

            <Image 
              source={logoImg}
              style={styles.logo}
            />

            <View style={styles.right}/>
        </View>

        <Image 
          source={{uri: game.bannerUrl}}
          style={styles.cover}
          resizeMode="cover"
        />

        <Heading 
          title={game.name}
          subtitle="Conecte-se e comece a jogar"
        />

        
        <FlatList 
        data={duos}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <DuoCard 
          data={item}
          onConnect={() => getDiscordUser(item.id)}
          />
        )}
        horizontal
        style={styles.containerList}
        contentContainerStyle={[duos.length > 0 ? styles.contentList : styles.emptyListContent]}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>
            Não há anúncios publicados ainda.
          </Text>
        )}
        />         
        
        <DuoMatch
          visible={discordDuoSelect.length > 0}
          discord={discordDuoSelect}
          onClose={() => setDiscordDuoSelect('')}
        />
      </SafeAreaView>
    </Background>
    
  );
}