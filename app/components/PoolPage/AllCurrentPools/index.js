import React, { useRef } from 'react';
import {
  CurrentPoolCard,
  PoolConfirmation,
  PoolDetails,
  TablePagination,
} from '@/components';
import { useState } from 'react';
import { PropTypes } from 'prop-types';
import { useEffect } from 'react';
import { getReq } from '@/utils/apiHandlers';

const AllCurrentPools = ({ openPoolDetails, setOpenPoolDetails }) => {
  const [confirmPool, setConfirmPool] = useState(null);
  const [currentPools, setCurrentPools] = useState([]);
  const [selectedCurrentPool, setSelectedCurrentPool] = useState({});
  /* eslint-disable */
  const [dataPerPage, setDataPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);
  const [divPosition, setDivPosition] = useState(0);

  const getCurrentPools = async () => {
    const dataToSkip = (currentPage - 1) * dataPerPage;
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('skip', dataToSkip);
      queryParams.append('take', dataPerPage);
      const res = await getReq(`/pool/current?${queryParams.toString()}`);
      const { data, error, status } = res;
      if (status) {
        setCurrentPools(data);
      } else if (error) {
        toast.alert(error?.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleEntryFeeClick = (data) => {
    setOpenPoolDetails(true);
    setSelectedCurrentPool(data);
  };
  const handleScroll = (e) => {
    let currentTargettedElement = e.target;
    const scrollPosition =
      currentTargettedElement.scrollTop + currentTargettedElement.clientHeight;
    const totalHeight = currentTargettedElement.scrollHeight;
    setDivPosition(scrollPosition);
  };

  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (dropdownRef.current) {
        dropdownRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [openPoolDetails]);
  useEffect(() => {
    getCurrentPools();
    if (dropdownRef.current) {
      dropdownRef.current.scrollTo({
        top: divPosition - 340,
        behavior: 'auto',
      });
    }
  }, [openPoolDetails]);
  useEffect(() => {
    getCurrentPools();
    if (dropdownRef.current) {
      dropdownRef.current.scrollTo({
        top: 0,
        behavior: 'auto',
      });
    }
  }, [currentPage]);

  const closeCard = () => {
    setOpenPoolDetails(false);
  };



  return (
    <div>
      {!openPoolDetails ? (
        <div
          ref={dropdownRef}
          className=" rounded-10 p-3 gap-3 flex flex-col w-full max-h-[350px] overflow-y-auto shadow-[0px_4.8px_12.49px_0px_#283FA333]"
        >
          {currentPools?.data?.map((data, index) => (
            <CurrentPoolCard
              key={index}
              item={data}
              currentPage={currentPage}
              handleEntryFeeClick={handleEntryFeeClick}
            />
          ))}
          <TablePagination
            data={currentPools}
            page={currentPage}
            dataToShowOnPage={dataPerPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      ) : (
        <PoolDetails
          pool={selectedCurrentPool}
          setConfirmPool={setConfirmPool}
          closeDetails={closeCard}
          getCurrentPools={getCurrentPools}
        />
      )}
      {confirmPool && <PoolConfirmation modalData={confirmPool} />}
    </div>
  );
};
AllCurrentPools.propTypes = {
  openPoolDetails: PropTypes.bool.isRequired,
  setOpenPoolDetails: PropTypes.func.isRequired,
};
export default AllCurrentPools;
