import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  Title,
  Text,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  ProgressBar,
  Badge,
  Grid,
  Col,
  Flex,
  List,
  ListItem,
} from '@tremor/react';

export default function AnalysisResults({ analysis }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'emerald';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  const renderScoreBar = (score) => {
    return (
      <ProgressBar
        value={score}
        color={getScoreColor(score)}
        className="mt-3"
        tooltip={`${Math.round(score)}% match`}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Title className="text-2xl font-bold text-white">Analysis Results</Title>

      <TabGroup>
        <TabList variant="solid" color="primary" className="bg-dark-700">
          <Tab>Overview</Tab>
          <Tab>Skills</Tab>
          <Tab>Details</Tab>
        </TabList>

        <TabPanels>
          {/* Overview Panel */}
          <TabPanel>
            <Grid numItems={1} numItemsSm={2} className="gap-6 mt-6">
              <Card className="bg-dark-700 border-none">
                <Title className="text-white mb-4">ATS Compatibility</Title>
                <Flex>
                  <Text>Overall Score</Text>
                  <Text color={getScoreColor(analysis.custom_score?.total_score || 0)}>
                    {Math.round(analysis.custom_score?.total_score || 0)}%
                  </Text>
                </Flex>
                {renderScoreBar(analysis.custom_score?.total_score || 0)}
              </Card>

              <Card className="bg-dark-700 border-none">
                <Title className="text-white mb-4">Key Checks</Title>
                <List>
                  {analysis.custom_score?.checks && Object.entries(analysis.custom_score.checks).map(([key, passed]) => (
                    <ListItem key={key}>
                      <Flex justifyContent="between" className="space-x-2">
                        <Text className="text-gray-300">
                          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </Text>
                        <Badge color={passed ? 'emerald' : 'red'}>
                          {passed ? 'Passed' : 'Failed'}
                        </Badge>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          </TabPanel>

          {/* Skills Panel */}
          <TabPanel>
            <Card className="bg-dark-700 border-none mt-6">
              <Title className="text-white mb-4">Skills Analysis</Title>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge
                      size="lg"
                      color="primary"
                      className="bg-primary-400/20"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabPanel>

          {/* Details Panel */}
          <TabPanel>
            <Grid numItems={1} numItemsSm={2} className="gap-6 mt-6">
              {/* Profile Matches */}
              <Col numColSpan={2}>
                <Card className="bg-dark-700 border-none">
                  <Title className="text-white mb-4">Job Profile Matches</Title>
                  <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-4">
                    {Object.entries(analysis.profile_scores).map(([profile, scores], index) => (
                      <motion.div
                        key={profile}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-dark-600 border-none">
                          <Title className="text-white mb-2">{profile}</Title>
                          <Flex className="mt-4">
                            <Text>Match Score</Text>
                            <Text color={getScoreColor(scores.total_score)}>
                              {Math.round(scores.total_score)}%
                            </Text>
                          </Flex>
                          {renderScoreBar(scores.total_score)}
                        </Card>
                      </motion.div>
                    ))}
                  </Grid>
                </Card>
              </Col>

              {/* Education */}
              {analysis.education?.length > 0 && (
                <Card className="bg-dark-700 border-none">
                  <Title className="text-white mb-4">Education</Title>
                  <List>
                    {analysis.education.map((edu, index) => (
                      <ListItem key={index}>
                        <Text className="text-gray-300">{edu}</Text>
                      </ListItem>
                    ))}
                  </List>
                </Card>
              )}

              {/* Experience */}
              {analysis.experience?.length > 0 && (
                <Card className="bg-dark-700 border-none">
                  <Title className="text-white mb-4">Experience</Title>
                  <List>
                    {analysis.experience.map((exp, index) => (
                      <ListItem key={index}>
                        <Text className="text-gray-300">{exp}</Text>
                      </ListItem>
                    ))}
                  </List>
                </Card>
              )}
            </Grid>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </motion.div>
  );
}
