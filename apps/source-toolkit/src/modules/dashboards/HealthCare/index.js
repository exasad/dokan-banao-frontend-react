import React, { useEffect } from 'react';
import AppRowContainer from '@crema/components/AppRowContainer';
import AppAnimate from '@crema/components/AppAnimate';
import {
  AppointmentCard,
  CancelVisits,
  DrCard,
  HealthStatics,
  HeartRate,
  HospitalActivity,
  HospitalStatics,
  InfoWidget,
  NewPatients,
  Notifications,
  ProfileCard,
  RecentPatients,
  TopDoctors,
  UpcomingAppointments,
  YourActivity,
} from '@crema/modules/dashboards/HealthCare';
import AppLoader from '@crema/components/AppLoader';
import { Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { onGetHCData } from '../../../toolkit/actions';

const HealthCare = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetHCData());
  }, [dispatch]);

  const { healthCare } = useSelector(({ dashboard }) => dashboard);

  return healthCare ? (
    <AppAnimate animation='transition.slideUpIn' delay={200}>
      <AppRowContainer>
        {healthCare.salesState.map((data, index) => (
          <Col xs={24} sm={12} lg={6} key={'a' + index}>
            <DrCard data={data} />
          </Col>
        ))}
        <Col xs={24} sm={24} lg={12} key={'b'}>
          <HospitalActivity data={healthCare.hospitalActivity} />
        </Col>
        <Col xs={24} sm={12} lg={6} key={'c'}>
          <ProfileCard />
        </Col>
        <Col xs={24} sm={12} lg={6} className='mb-0' key={'d'}>
          <AppRowContainer>
            {healthCare.appointmentCards.map((data, index) => (
              <Col xs={24} key={'e' + index}>
                <AppointmentCard data={data} />
              </Col>
            ))}
          </AppRowContainer>
        </Col>
        <Col xs={24} sm={12} lg={6} key={'f'}>
          <HeartRate data={healthCare.heartCard} />
        </Col>
        <Col xs={24} sm={12} lg={6} key={'g'}>
          <YourActivity data={healthCare.yourActivity} />
        </Col>
        <Col xs={24} sm={12} lg={6} key={'h'}>
          <HeartRate data={healthCare.temperatureCard} />
        </Col>
        <Col xs={24} sm={12} lg={6} className='mb-0' key={'i'}>
          <AppRowContainer>
            {healthCare.doses.map((data, index) => (
              <Col xs={24} key={'j' + index}>
                <HospitalStatics data={data} />
              </Col>
            ))}
          </AppRowContainer>
        </Col>
        <Col xs={24} sm={24} lg={8} key={'k'}>
          <TopDoctors data={healthCare.topDoctors} />
        </Col>
        <Col xs={24} sm={24} lg={8} key={'l'}>
          <UpcomingAppointments data={healthCare.upcomingAppointment} />
        </Col>
        <Col xs={24} sm={24} lg={8} key={'o'}>
          <Notifications data={healthCare.notifications} />
        </Col>
        <Col xs={24} md={24} lg={12} key={'m'}>
          <HealthStatics data={healthCare.heathStatics} />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} key={'n'}>
          <NewPatients data={healthCare.newPatients} />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} key={'p'}>
          <CancelVisits data={healthCare.cancelVisits} />
        </Col>
        {healthCare.hospitalStatics.map((data, index) => (
          <Col xs={24} sm={12} lg={6} key={'q' + index}>
            <HospitalStatics data={data} />
          </Col>
        ))}
        <Col xs={24} sm={24} lg={16} key={'r'}>
          <RecentPatients recentPatients={healthCare.recentPatients} />
        </Col>
        <Col xs={24} sm={24} lg={8} className='mb-0' key={'s'}>
          <AppRowContainer>
            {healthCare.bloodCard.map((data, index) => (
              <Col xs={24} sm={12} key={'t' + index}>
                <InfoWidget data={data} />
              </Col>
            ))}
          </AppRowContainer>
        </Col>
      </AppRowContainer>
    </AppAnimate>
  ) : (
    <AppLoader />
  );
};

export default HealthCare;
