import { useQuery } from '@tanstack/react-query';
import { getVipUserAnswers } from '../../../utils/apiCalls';
import { useParams } from 'react-router-dom';

const useVipQuestions = (accordionOpen) => {
  const { userId } = useParams();
  const {
    data: vipAnswersList,
    isLoading: isVipAnswerLoading,
  } = useQuery({
    queryKey: ['vipAnswersList', userId],
    queryFn: ({ queryKey }) => {
      const params = {};
      if (queryKey[1]) params.userId = queryKey[1];
      return getVipUserAnswers(params);
    },
    select: (res) => res?.data?.data,
    enabled: accordionOpen,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    vipAnswersList,
    isVipAnswerLoading,
  };
};

export default useVipQuestions;
