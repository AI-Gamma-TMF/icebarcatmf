import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from '../../../components/Toast';
import { useTranslation } from 'react-i18next';
import { AdminRoutes } from '../../../routes';
import { useReorderCasinoProvidersMutation } from '../../../reactQuery/hooks/customMutationHook';
import { getAllCasinoProviders } from '../../../utils/apiCalls';

const useReorderProviders = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({ rows: [], count: 0 });
    const queryClient = useQueryClient();
    const { t } = useTranslation(['casino']);

    const { isLoading: fetchLoading } = useQuery({
        queryKey: ['casinoProviders'],
        onSuccess: (data) => setState(data),
        queryFn: ()=>{
            const params = {orderBy:'orderId', sort:'asc'};
            return getAllCasinoProviders(params)
        },
        select: (res) => res?.data?.casinoProvider,
        refetchOnWindowFocus: false,
    });


    const reorder = (subCategories, startIndex, endIndex) => {
        const result = Array.from(subCategories);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        if (result.destination.index === result.source.index) return;

        const rows = reorder(state.rows, result.source.index, result.destination.index);
        setState({ rows, count: rows.length });
    };

    const { mutate: reorderProvider, isLoading: updateLoading } = useReorderCasinoProvidersMutation({
        onSuccess: () => {
            toast(t('casinoProvider.providerReorderSuccessToast'), 'success');
            queryClient.invalidateQueries({ queryKey: ['casinoProviders'] }); // This will refetch the providers
            navigate(AdminRoutes.CasinoProviders);
        },
        onError: (error) => {
            console.error("Reordering failed:", error);
        },
    });

    const handleSave = () => {
        const order = state.rows.map(list => list.masterCasinoProviderId);
        reorderProvider({ order });
    };

    return {
        t,
        loading: fetchLoading || updateLoading,
        state,
        onDragEnd,
        handleSave,
        navigate,
    };
};


export default useReorderProviders;


