import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.warn('Seeding TrackPulse database...');

  // ========================================
  // Organizations
  // ========================================
  const trackField = await prisma.organization.create({
    data: {
      name: 'TrackField Projects',
      slug: 'trackfield-projects',
      type: 'CONSULTANCY',
    },
  });

  const tigerOrg = await prisma.organization.create({
    data: {
      name: 'Tiger Brands',
      slug: 'tiger-brands',
      type: 'CLIENT',
    },
  });

  // ========================================
  // Users
  // ========================================
  const adminPassword = await bcrypt.hash('TrackField@2024', 12);
  const analystPassword = await bcrypt.hash('Analyst@2024', 12);
  const clientPassword = await bcrypt.hash('Client@2024', 12);

  await prisma.user.create({
    data: {
      email: 'sam@trackfield.com',
      passwordHash: adminPassword,
      name: 'Samundombe Ilalio',
      role: 'ADMIN',
      organizationId: trackField.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'analyst@trackfield.com',
      passwordHash: analystPassword,
      name: 'Sarah Chen',
      role: 'ANALYST',
      organizationId: trackField.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'tigerbrands@client.za',
      passwordHash: clientPassword,
      name: 'Thabo Nkosi',
      role: 'CLIENT_VIEWER',
      organizationId: tigerOrg.id,
    },
  });

  // ========================================
  // Clients & Brands
  // ========================================
  const tigerBrands = await prisma.client.create({
    data: {
      name: 'Tiger Brands',
      slug: 'tiger-brands',
      primaryColor: '#E11D48',
      organizationId: trackField.id,
    },
  });

  const jungleOats = await prisma.brand.create({
    data: {
      name: 'Jungle Oats',
      slug: 'jungle-oats',
      clientId: tigerBrands.id,
    },
  });

  // ========================================
  // Study
  // ========================================
  const study = await prisma.study.create({
    data: {
      name: 'South Africa Cereal Brand Tracker 2023-2024',
      description: 'Quarterly consumer brand health tracking study for cereal brands in South Africa',
      brandId: jungleOats.id,
      country: 'South Africa',
      startDate: new Date('2023-01-01'),
    },
  });

  // ========================================
  // Competitor Brands
  // ========================================
  const competitors = ['Weet-Bix', "Kellogg's", 'ProNutro', 'Future Life'];
  const competitorRecords = [];
  for (const name of competitors) {
    const comp = await prisma.competitorBrand.create({
      data: { name, studyId: study.id },
    });
    competitorRecords.push(comp);
  }

  // ========================================
  // Waves (Q1-2023 through Q2-2024)
  // ========================================
  const waveDefinitions = [
    { label: 'Q1-2023', period: 'Jan-Mar 2023', start: '2023-01-15', end: '2023-03-15', n: 502 },
    { label: 'Q2-2023', period: 'Apr-Jun 2023', start: '2023-04-15', end: '2023-06-15', n: 515 },
    { label: 'Q3-2023', period: 'Jul-Sep 2023', start: '2023-07-15', end: '2023-09-15', n: 498 },
    { label: 'Q4-2023', period: 'Oct-Dec 2023', start: '2023-10-15', end: '2023-12-15', n: 521 },
    { label: 'Q1-2024', period: 'Jan-Mar 2024', start: '2024-01-15', end: '2024-03-15', n: 510 },
    { label: 'Q2-2024', period: 'Apr-Jun 2024', start: '2024-04-15', end: '2024-06-15', n: 508 },
  ];

  const waves = [];
  for (const w of waveDefinitions) {
    const wave = await prisma.wave.create({
      data: {
        label: w.label,
        studyId: study.id,
        period: w.period,
        status: 'PUBLISHED',
        fieldworkStart: new Date(w.start),
        fieldworkEnd: new Date(w.end),
        targetN: 500,
        actualN: w.n,
      },
    });
    waves.push(wave);
  }

  // ========================================
  // Brand Metrics — Jungle Oats (realistic trend data)
  // ========================================
  const jungleOatsMetrics: Record<string, number[]> = {
    tom_awareness:          [42.3, 43.8, 44.1, 45.2, 44.8, 46.5],
    spontaneous_awareness:  [68.5, 69.2, 70.1, 71.3, 70.8, 72.4],
    aided_awareness:        [92.1, 92.8, 93.2, 93.5, 93.1, 94.2],
    consideration:          [55.2, 56.1, 55.8, 57.3, 56.9, 58.4],
    trial:                  [48.3, 49.1, 48.7, 50.2, 49.8, 51.3],
    regular_use:            [31.2, 32.1, 31.8, 33.4, 32.9, 34.1],
    consumption_30day:      [45.8, 46.5, 47.2, 48.1, 47.5, 49.3],
    ad_awareness:           [38.2, 39.5, 41.3, 42.8, 41.2, 43.5],
    share_of_voice:         [32.5, 33.1, 34.2, 35.8, 34.5, 36.2],
    quality_perception:     [3.8,  3.9,  3.85, 4.0,  3.95, 4.1],
    value_perception:       [3.5,  3.6,  3.55, 3.7,  3.65, 3.8],
    nps_proxy:              [22,   24,   23,   26,   25,   28],
  };

  for (const [metric, values] of Object.entries(jungleOatsMetrics)) {
    for (let i = 0; i < waves.length; i++) {
      await prisma.brandMetric.create({
        data: {
          brandId: jungleOats.id,
          waveId: waves[i].id,
          metric,
          value: values[i],
          baseSize: waveDefinitions[i].n,
        },
      });
    }
  }

  // ========================================
  // Competitor Metrics
  // ========================================
  const competitorData: Record<string, Record<string, number[]>> = {
    'Weet-Bix': {
      tom_awareness:          [18.5, 19.2, 18.8, 19.5, 19.1, 18.3],
      spontaneous_awareness:  [45.2, 46.1, 45.8, 46.5, 46.2, 45.5],
      aided_awareness:        [82.3, 83.1, 82.8, 83.5, 83.2, 82.5],
      consumption_30day:      [28.5, 29.2, 28.8, 29.5, 29.1, 28.3],
      ad_awareness:           [22.3, 23.1, 22.8, 23.5, 23.2, 22.5],
      share_of_voice:         [25.2, 24.8, 25.5, 24.3, 25.1, 24.5],
      quality_perception:     [3.5, 3.6, 3.55, 3.6, 3.55, 3.5],
      value_perception:       [3.3, 3.4, 3.35, 3.4, 3.35, 3.3],
    },
    "Kellogg's": {
      tom_awareness:          [12.3, 11.8, 12.5, 11.5, 12.1, 11.2],
      spontaneous_awareness:  [35.2, 34.8, 35.5, 34.5, 35.1, 34.2],
      aided_awareness:        [75.3, 74.8, 75.5, 74.5, 75.1, 74.2],
      consumption_30day:      [18.5, 17.8, 18.2, 17.5, 18.1, 17.2],
      ad_awareness:           [15.3, 14.8, 15.5, 14.5, 15.1, 14.2],
      share_of_voice:         [18.5, 19.2, 18.3, 19.5, 18.8, 19.1],
      quality_perception:     [3.2, 3.1, 3.25, 3.15, 3.2, 3.1],
      value_perception:       [3.6, 3.5, 3.55, 3.5, 3.55, 3.45],
    },
    ProNutro: {
      tom_awareness:          [8.5, 8.2, 8.8, 8.1, 8.5, 7.8],
      spontaneous_awareness:  [25.2, 24.8, 25.5, 24.5, 25.1, 24.2],
      aided_awareness:        [68.3, 67.8, 68.5, 67.5, 68.1, 67.2],
      consumption_30day:      [12.5, 12.2, 12.8, 12.1, 12.5, 11.8],
      ad_awareness:           [10.3, 9.8, 10.5, 9.5, 10.1, 9.2],
      share_of_voice:         [12.5, 12.2, 11.8, 12.5, 11.5, 12.1],
      quality_perception:     [3.0, 2.9, 3.05, 2.95, 3.0, 2.9],
      value_perception:       [3.8, 3.7, 3.75, 3.7, 3.75, 3.65],
    },
    'Future Life': {
      tom_awareness:          [5.2, 5.5, 5.1, 5.8, 5.3, 5.9],
      spontaneous_awareness:  [18.5, 19.2, 18.8, 19.5, 19.1, 20.2],
      aided_awareness:        [58.3, 59.1, 58.8, 59.5, 59.2, 60.5],
      consumption_30day:      [8.5, 9.2, 8.8, 9.5, 9.1, 10.2],
      ad_awareness:           [8.3, 9.1, 8.8, 9.5, 9.2, 10.5],
      share_of_voice:         [11.3, 10.7, 10.2, 7.9, 10.1, 8.1],
      quality_perception:     [3.1, 3.2, 3.15, 3.25, 3.2, 3.3],
      value_perception:       [3.4, 3.5, 3.45, 3.55, 3.5, 3.6],
    },
  };

  for (const [compName, metrics] of Object.entries(competitorData)) {
    const comp = competitorRecords.find((c) => c.name === compName);
    if (!comp) continue;

    for (const [metric, values] of Object.entries(metrics)) {
      for (let i = 0; i < waves.length; i++) {
        await prisma.brandMetric.create({
          data: {
            brandId: jungleOats.id,
            competitorBrandId: comp.id,
            waveId: waves[i].id,
            metric,
            value: values[i],
            baseSize: waveDefinitions[i].n,
          },
        });
      }
    }
  }

  // ========================================
  // Segment Breakdown Metrics (latest wave — Q2-2024)
  // ========================================
  const latestWave = waves[waves.length - 1];
  const segments: Record<string, Record<string, number>> = {
    sex: {
      Male: 48.2,
      Female: 50.5,
    },
    age_group: {
      '18-24': 42.1,
      '25-34': 51.3,
      '35-44': 53.8,
      '45-54': 47.2,
      '55+': 44.5,
    },
    lsm: {
      'LSM 8-10': 55.2,
      'LSM 7': 51.8,
      'LSM 5-6': 48.5,
      'LSM 4': 44.2,
      'LSM 1-3': 38.5,
    },
    province: {
      Gauteng: 52.3,
      'Western Cape': 49.8,
      KwaZulu_Natal: 51.2,
      'Eastern Cape': 45.6,
      'Free State': 43.8,
      Limpopo: 47.5,
    },
  };

  for (const [segmentType, segmentValues] of Object.entries(segments)) {
    for (const [segValue, value] of Object.entries(segmentValues)) {
      await prisma.brandMetric.create({
        data: {
          brandId: jungleOats.id,
          waveId: latestWave.id,
          metric: 'consumption_30day',
          value,
          baseSize: Math.floor(waveDefinitions[5].n * (0.1 + Math.random() * 0.3)),
          segment: segmentType,
          segmentValue: segValue,
        },
      });
    }
  }

  console.warn('Seeding complete!');
  console.warn('---');
  console.warn('Demo Logins:');
  console.warn('  sam@trackfield.com / TrackField@2024');
  console.warn('  analyst@trackfield.com / Analyst@2024');
  console.warn('  tigerbrands@client.za / Client@2024');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
