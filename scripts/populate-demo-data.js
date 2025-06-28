const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function populateDemoData() {
  try {
    console.log('🚀 Starting to populate demo data...');

    // Insert demo courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .insert([
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: 'English Grammar Mastery',
          description: 'Complete English grammar course designed for government exam aspirants. Master all essential grammar concepts with interactive lessons and practice exercises.',
          subject: 'English',
          is_published: true,
          is_free: true,
          price: 0
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          title: 'Educational Psychology',
          description: 'Comprehensive course covering educational psychology concepts essential for teaching exams like CTET, TET, and other government teaching positions.',
          subject: 'Psychology',
          is_published: true,
          is_free: true,
          price: 0
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          title: 'Advanced English Literature',
          description: 'In-depth study of English literature for competitive exams. Covers major authors, literary movements, and critical analysis techniques.',
          subject: 'English',
          is_published: true,
          is_free: false,
          price: 299.00
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          title: 'Quantitative Aptitude Basics',
          description: 'Foundation course in quantitative aptitude covering arithmetic, algebra, and basic mathematics for government exams.',
          subject: 'Mathematics',
          is_published: true,
          is_free: true,
          price: 0
        }
      ])
      .select();

    if (coursesError) {
      console.error('Error inserting courses:', coursesError);
      return;
    }

    console.log('✅ Courses inserted successfully');

    // Insert demo lessons for English Grammar Mastery
    const { error: lessonsError1 } = await supabase
      .from('lessons')
      .insert([
        {
          course_id: '550e8400-e29b-41d4-a716-446655440001',
          title: 'Introduction to Parts of Speech',
          content: `# Parts of Speech

## What are Parts of Speech?

Parts of speech are the building blocks of English grammar. Every word in English belongs to one of eight categories:

1. **Noun** - Names of people, places, things, or ideas
2. **Pronoun** - Words that replace nouns
3. **Verb** - Action or state of being words
4. **Adjective** - Words that describe nouns
5. **Adverb** - Words that describe verbs, adjectives, or other adverbs
6. **Preposition** - Words that show relationships between other words
7. **Conjunction** - Words that connect other words or groups of words
8. **Interjection** - Words that express emotion

## Examples

- **Noun**: book, teacher, happiness
- **Pronoun**: he, she, it, they
- **Verb**: run, think, is, have
- **Adjective**: beautiful, large, red
- **Adverb**: quickly, very, well
- **Preposition**: in, on, under, between
- **Conjunction**: and, but, or, because
- **Interjection**: oh, wow, alas

Understanding parts of speech is crucial for:
- Sentence construction
- Grammar rules application
- Effective communication
- Competitive exam success`,
          order_index: 1,
          is_preview: true,
          estimated_duration: 25
        },
        {
          course_id: '550e8400-e29b-41d4-a716-446655440001',
          title: 'Nouns: Types and Usage',
          content: `# Nouns: Types and Usage

## Definition
A noun is a word that names a person, place, thing, or idea.

## Types of Nouns

### 1. Common Nouns
General names for people, places, or things.
- Examples: teacher, city, book, happiness

### 2. Proper Nouns
Specific names of people, places, or things (always capitalized).
- Examples: John, Delhi, Ramayana, Monday

### 3. Concrete Nouns
Things you can see, touch, hear, smell, or taste.
- Examples: apple, music, perfume, stone

### 4. Abstract Nouns
Ideas, emotions, or concepts you cannot physically touch.
- Examples: love, freedom, intelligence, beauty

### 5. Collective Nouns
Names for groups of people, animals, or things.
- Examples: team, flock, bunch, committee

### 6. Countable Nouns
Nouns that can be counted (have singular and plural forms).
- Examples: book/books, child/children, mouse/mice

### 7. Uncountable Nouns
Nouns that cannot be counted (usually no plural form).
- Examples: water, information, advice, furniture

## Important Rules

1. Proper nouns are always capitalized
2. Collective nouns can be singular or plural depending on context
3. Some nouns can be both countable and uncountable with different meanings
4. Abstract nouns are usually uncountable

## Practice Questions
1. Identify the type of noun: "The committee has made its decision."
2. Which is correct: "I need some informations" or "I need some information"?`,
          order_index: 2,
          is_preview: true,
          estimated_duration: 30
        },
        {
          course_id: '550e8400-e29b-41d4-a716-446655440001',
          title: 'Pronouns and Their Types',
          content: `# Pronouns and Their Types

## Definition
A pronoun is a word that takes the place of a noun to avoid repetition.

## Types of Pronouns

### 1. Personal Pronouns
Refer to specific people or things.

**Subject Pronouns**: I, you, he, she, it, we, they
**Object Pronouns**: me, you, him, her, it, us, them

### 2. Possessive Pronouns
Show ownership or possession.

**Possessive Adjectives**: my, your, his, her, its, our, their
**Possessive Pronouns**: mine, yours, his, hers, its, ours, theirs

### 3. Reflexive Pronouns
Refer back to the subject of the sentence.
- myself, yourself, himself, herself, itself, ourselves, yourselves, themselves

### 4. Demonstrative Pronouns
Point to specific things.
- this, that, these, those

### 5. Interrogative Pronouns
Used to ask questions.
- who, whom, whose, which, what

### 6. Relative Pronouns
Connect clauses and refer to nouns mentioned earlier.
- who, whom, whose, which, that

### 7. Indefinite Pronouns
Refer to non-specific people or things.
- someone, anyone, everyone, nothing, all, some, many, few

## Common Mistakes to Avoid

1. **Subject vs Object Pronouns**
   - Correct: "He and I went to the store."
   - Incorrect: "Him and me went to the store."

2. **Reflexive Pronoun Usage**
   - Correct: "I did it myself."
   - Incorrect: "Myself did it."

3. **Who vs Whom**
   - Who: subject (Who is coming?)
   - Whom: object (To whom did you give it?)

## Practice Exercise
Replace the repeated nouns with appropriate pronouns:
"John gave John's book to Mary. Mary thanked John for John's kindness."`,
          order_index: 3,
          is_preview: false,
          estimated_duration: 35
        },
        {
          course_id: '550e8400-e29b-41d4-a716-446655440001',
          title: 'Verbs: Action and Linking Verbs',
          content: `# Verbs: Action and Linking Verbs

## What is a Verb?
A verb is a word that expresses action, occurrence, or state of being.

## Types of Verbs

### 1. Action Verbs
Express physical or mental action.

**Physical Action**: run, jump, write, eat, dance
**Mental Action**: think, believe, remember, understand, imagine

### 2. Linking Verbs
Connect the subject to additional information about the subject.

**Common Linking Verbs**:
- Forms of "be": am, is, are, was, were, being, been
- Sensory verbs: look, sound, smell, taste, feel
- Other linking verbs: seem, appear, become, grow, remain, stay

### 3. Helping Verbs (Auxiliary Verbs)
Work with main verbs to form verb phrases.

**Primary Helping Verbs**: be, have, do
**Modal Helping Verbs**: can, could, may, might, must, shall, should, will, would

## Verb Tenses

### Present Tense
- Simple Present: I write
- Present Continuous: I am writing
- Present Perfect: I have written
- Present Perfect Continuous: I have been writing

### Past Tense
- Simple Past: I wrote
- Past Continuous: I was writing
- Past Perfect: I had written
- Past Perfect Continuous: I had been writing

### Future Tense
- Simple Future: I will write
- Future Continuous: I will be writing
- Future Perfect: I will have written
- Future Perfect Continuous: I will have been writing

## Subject-Verb Agreement Rules

1. Singular subjects take singular verbs
2. Plural subjects take plural verbs
3. Compound subjects joined by "and" are plural
4. Subjects joined by "or" or "nor" agree with the nearest subject
5. Collective nouns can be singular or plural depending on context

## Common Errors

1. **Incorrect**: "He don't know the answer."
   **Correct**: "He doesn't know the answer."

2. **Incorrect**: "The team are playing well."
   **Correct**: "The team is playing well." (when acting as one unit)`,
          order_index: 4,
          is_preview: false,
          estimated_duration: 40
        },
        {
          course_id: '550e8400-e29b-41d4-a716-446655440001',
          title: 'Adjectives and Adverbs',
          content: `# Adjectives and Adverbs

## Adjectives

### Definition
Adjectives describe or modify nouns and pronouns.

### Types of Adjectives

1. **Descriptive Adjectives**: beautiful, large, red, intelligent
2. **Quantitative Adjectives**: some, many, few, several, all
3. **Demonstrative Adjectives**: this, that, these, those
4. **Possessive Adjectives**: my, your, his, her, its, our, their
5. **Interrogative Adjectives**: which, what, whose
6. **Articles**: a, an, the

### Degrees of Comparison

1. **Positive Degree**: tall, beautiful, good
2. **Comparative Degree**: taller, more beautiful, better
3. **Superlative Degree**: tallest, most beautiful, best

### Rules for Comparison

- One syllable: add -er, -est (tall, taller, tallest)
- Two syllables ending in -y: change y to i, add -er, -est (happy, happier, happiest)
- Two or more syllables: use more/most (beautiful, more beautiful, most beautiful)
- Irregular forms: good/better/best, bad/worse/worst

## Adverbs

### Definition
Adverbs modify verbs, adjectives, or other adverbs.

### Types of Adverbs

1. **Manner**: quickly, carefully, well, badly
2. **Time**: now, then, yesterday, soon, always
3. **Place**: here, there, everywhere, outside
4. **Frequency**: always, often, sometimes, never
5. **Degree**: very, quite, extremely, rather

### Formation of Adverbs

Most adverbs are formed by adding -ly to adjectives:
- quick → quickly
- careful → carefully
- easy → easily

### Irregular Adverbs
- good → well
- fast → fast
- hard → hard
- late → late

### Position of Adverbs

1. **Adverbs of manner**: usually after the verb or object
   - "She sings beautifully."
   - "He completed the task carefully."

2. **Adverbs of frequency**: usually before the main verb
   - "I always brush my teeth."
   - "She never arrives late."

3. **Adverbs of time**: usually at the beginning or end of a sentence
   - "Yesterday, I went to the market."
   - "I will call you tomorrow."

## Common Mistakes

1. **Adjective vs Adverb confusion**
   - Incorrect: "She sings good."
   - Correct: "She sings well."

2. **Double comparatives**
   - Incorrect: "more better"
   - Correct: "better"`,
          order_index: 5,
          is_preview: false,
          estimated_duration: 35
        }
      ]);

    if (lessonsError1) {
      console.error('Error inserting English Grammar lessons:', lessonsError1);
      return;
    }

    console.log('✅ English Grammar lessons inserted successfully');

    // Insert demo lessons for Educational Psychology
    const { error: lessonsError2 } = await supabase
      .from('lessons')
      .insert([
        {
          course_id: '550e8400-e29b-41d4-a716-446655440002',
          title: 'Introduction to Educational Psychology',
          content: `# Introduction to Educational Psychology

## What is Educational Psychology?

Educational Psychology is the scientific study of human learning and development in educational settings. It combines principles from psychology with educational practice to understand how students learn and develop.

## Key Areas of Study

### 1. Learning Theories
- **Behaviorism**: Learning through conditioning and reinforcement
- **Cognitivism**: Learning as mental processes and information processing
- **Constructivism**: Learning through active construction of knowledge
- **Social Learning Theory**: Learning through observation and modeling

### 2. Developmental Psychology
- **Cognitive Development**: How thinking abilities develop (Piaget's stages)
- **Social Development**: How social skills and relationships develop
- **Moral Development**: How ethical reasoning develops (Kohlberg's stages)
- **Physical Development**: How motor skills and physical abilities develop

### 3. Individual Differences
- **Intelligence**: Multiple intelligences, IQ, emotional intelligence
- **Learning Styles**: Visual, auditory, kinesthetic preferences
- **Personality**: How personality affects learning
- **Special Needs**: Learning disabilities, giftedness, ADHD

### 4. Motivation and Emotion
- **Intrinsic vs Extrinsic Motivation**: Internal vs external drivers
- **Achievement Motivation**: Drive to succeed and excel
- **Self-Efficacy**: Belief in one's ability to succeed
- **Emotional Factors**: How emotions affect learning

## Importance for Teachers

Understanding educational psychology helps teachers:
1. **Design Effective Lessons**: Based on how students learn best
2. **Manage Classrooms**: Understanding behavior and motivation
3. **Assess Students**: Appropriate evaluation methods
4. **Support Diverse Learners**: Meeting individual needs
5. **Promote Development**: Supporting overall growth

## Historical Perspectives

### Key Figures
- **John Dewey**: Progressive education, learning by doing
- **Jean Piaget**: Cognitive development stages
- **Lev Vygotsky**: Social constructivism, zone of proximal development
- **B.F. Skinner**: Operant conditioning, programmed learning
- **Albert Bandura**: Social learning theory, self-efficacy

## Modern Applications

Educational psychology principles are applied in:
- Curriculum design
- Teaching methodologies
- Assessment strategies
- Special education
- Educational technology
- Teacher training programs

## Research Methods

Educational psychologists use various research methods:
1. **Experimental Studies**: Controlled experiments
2. **Observational Studies**: Classroom observations
3. **Case Studies**: In-depth individual analysis
4. **Surveys**: Large-scale data collection
5. **Longitudinal Studies**: Long-term development tracking`,
          order_index: 1,
          is_preview: true,
          estimated_duration: 30
        },
        {
          course_id: '550e8400-e29b-41d4-a716-446655440002',
          title: 'Piaget\'s Theory of Cognitive Development',
          content: `# Piaget's Theory of Cognitive Development

## Jean Piaget (1896-1980)

Swiss psychologist who revolutionized our understanding of how children think and learn. His theory describes how children's thinking develops through distinct stages.

## Key Concepts

### 1. Schema
Mental structures that organize knowledge and guide thinking.
- **Example**: A child's schema for "dog" might include four legs, fur, barking

### 2. Assimilation
Incorporating new information into existing schemas.
- **Example**: Seeing a cat and calling it a "dog" because it fits the existing schema

### 3. Accommodation
Modifying existing schemas or creating new ones when new information doesn't fit.
- **Example**: Learning that cats are different from dogs and creating a new schema

### 4. Equilibration
The balance between assimilation and accommodation that drives cognitive development.

## Four Stages of Cognitive Development

### Stage 1: Sensorimotor Stage (0-2 years)

**Characteristics:**
- Learning through senses and motor actions
- Development of object permanence
- Beginning of symbolic thought

**Key Milestones:**
- Object permanence (8-12 months)
- Deferred imitation
- Beginning of language

**Educational Implications:**
- Provide rich sensory experiences
- Use concrete, manipulative materials
- Encourage exploration and discovery

### Stage 2: Preoperational Stage (2-7 years)

**Characteristics:**
- Symbolic thinking develops
- Language acquisition accelerates
- Egocentrism (difficulty seeing others' perspectives)
- Centration (focusing on one aspect)
- Lack of conservation

**Key Features:**
- **Animism**: Attributing life to inanimate objects
- **Artificialism**: Believing everything is made by humans
- **Irreversibility**: Cannot mentally reverse operations

**Educational Implications:**
- Use concrete examples and visual aids
- Encourage pretend play
- Be patient with egocentric thinking
- Provide hands-on learning experiences

### Stage 3: Concrete Operational Stage (7-11 years)

**Characteristics:**
- Logical thinking about concrete objects
- Understanding of conservation
- Ability to classify and seriate
- Reversibility of thought

**Key Abilities:**
- **Conservation**: Understanding that quantity remains the same despite changes in appearance
- **Classification**: Grouping objects by common properties
- **Seriation**: Arranging objects in order
- **Transitivity**: Understanding relationships (if A>B and B>C, then A>C)

**Educational Implications:**
- Use concrete materials and examples
- Encourage hands-on experiments
- Teach classification and organization skills
- Introduce logical problem-solving

### Stage 4: Formal Operational Stage (11+ years)

**Characteristics:**
- Abstract and hypothetical thinking
- Scientific reasoning
- Systematic problem-solving
- Idealistic thinking

**Key Abilities:**
- **Hypothetical-deductive reasoning**: Testing hypotheses systematically
- **Abstract thinking**: Understanding concepts without concrete examples
- **Metacognition**: Thinking about thinking
- **Propositional logic**: Understanding "if-then" relationships

**Educational Implications:**
- Encourage abstract thinking and debate
- Use hypothetical scenarios
- Teach scientific method
- Promote critical thinking skills

## Criticisms and Limitations

1. **Cultural Bias**: Theory based primarily on Western, middle-class children
2. **Underestimation**: Children may be more capable than Piaget suggested
3. **Individual Differences**: Not all children develop at the same rate
4. **Domain Specificity**: Development may vary across different areas

## Educational Applications

### Teaching Strategies Based on Piaget:
1. **Readiness**: Ensure students are developmentally ready for concepts
2. **Active Learning**: Encourage hands-on exploration
3. **Discovery Learning**: Let students discover concepts themselves
4. **Peer Interaction**: Promote collaborative learning
5. **Cognitive Conflict**: Present challenges that require accommodation

### Assessment Considerations:
- Use age-appropriate assessment methods
- Consider developmental stage in evaluation
- Focus on understanding, not just memorization
- Allow for individual developmental differences`,
          order_index: 2,
          is_preview: true,
          estimated_duration: 45
        },
        {
          course_id: '550e8400-e29b-41d4-a716-446655440002',
          title: 'Learning Theories: Behaviorism',
          content: `# Learning Theories: Behaviorism

## Overview of Behaviorism

Behaviorism is a learning theory that focuses on observable behaviors rather than internal mental processes. It suggests that all behaviors are learned through interaction with the environment.

## Key Principles

1. **Observable Behavior**: Only measurable, observable behaviors matter
2. **Environmental Influence**: Behavior is shaped by environmental factors
3. **Stimulus-Response**: Learning occurs through stimulus-response associations
4. **Reinforcement**: Consequences determine whether behaviors continue

## Classical Conditioning

### Ivan Pavlov (1849-1936)

**Basic Process:**
- **Unconditioned Stimulus (UCS)**: Naturally triggers a response (food)
- **Unconditioned Response (UCR)**: Natural response (salivation)
- **Conditioned Stimulus (CS)**: Learned trigger (bell)
- **Conditioned Response (CR)**: Learned response (salivation to bell)

**Educational Applications:**
- Creating positive associations with learning
- Reducing test anxiety through relaxation techniques
- Building positive classroom environments

### Key Concepts:
- **Acquisition**: Learning the association
- **Extinction**: Weakening of conditioned response
- **Generalization**: Responding to similar stimuli
- **Discrimination**: Responding only to specific stimuli

## Operant Conditioning

### B.F. Skinner (1904-1990)

**Basic Principle:** Behavior is influenced by its consequences

### Types of Consequences:

#### 1. Positive Reinforcement
Adding something pleasant to increase behavior
- **Examples**: Praise, rewards, privileges, good grades

#### 2. Negative Reinforcement
Removing something unpleasant to increase behavior
- **Examples**: Removing homework for good behavior, ending detention early

#### 3. Positive Punishment
Adding something unpleasant to decrease behavior
- **Examples**: Extra homework, detention, verbal reprimand

#### 4. Negative Punishment
Removing something pleasant to decrease behavior
- **Examples**: Loss of privileges, time-out, removal of preferred activities

### Schedules of Reinforcement:

#### Continuous Reinforcement
Reinforcing every occurrence of the behavior
- **Best for**: Initial learning
- **Characteristics**: Fast learning, fast extinction

#### Partial Reinforcement
Reinforcing some occurrences of the behavior

1. **Fixed Ratio (FR)**: Reinforcement after a set number of responses
   - Example: Reward after every 5 correct answers

2. **Variable Ratio (VR)**: Reinforcement after varying numbers of responses
   - Example: Pop quizzes, lottery systems

3. **Fixed Interval (FI)**: Reinforcement after a set time period
   - Example: Weekly tests, monthly evaluations

4. **Variable Interval (VI)**: Reinforcement after varying time periods
   - Example: Random classroom visits by principal

## Educational Applications

### Classroom Management:
1. **Token Economy**: Students earn tokens for good behavior
2. **Behavior Charts**: Visual tracking of student behavior
3. **Contingency Contracts**: Agreements about behavior and consequences
4. **Time-out**: Removing student from reinforcing environment

### Teaching Strategies:
1. **Programmed Instruction**: Breaking content into small steps
2. **Computer-Assisted Learning**: Immediate feedback and reinforcement
3. **Mastery Learning**: Students must master one level before advancing
4. **Behavioral Objectives**: Clear, measurable learning goals

### Motivation Techniques:
1. **Immediate Feedback**: Quick reinforcement of correct responses
2. **Shaping**: Reinforcing successive approximations of desired behavior
3. **Chaining**: Teaching complex behaviors step by step
4. **Modeling**: Demonstrating desired behaviors

## Advantages of Behaviorist Approach

1. **Clear Structure**: Specific objectives and measurable outcomes
2. **Effective for Basic Skills**: Good for drill and practice
3. **Behavior Management**: Effective classroom control strategies
4. **Immediate Results**: Quick behavior changes possible
5. **Objective Assessment**: Measurable learning outcomes

## Limitations and Criticisms

1. **Oversimplification**: Ignores complex mental processes
2. **Limited Creativity**: May discourage creative thinking
3. **External Motivation**: Relies on external rewards
4. **Individual Differences**: One-size-fits-all approach
5. **Ethical Concerns**: Manipulation vs. education

## Modern Applications

### Technology Integration:
- Educational software with immediate feedback
- Gamification of learning
- Adaptive learning systems
- Online behavior tracking

### Special Education:
- Applied Behavior Analysis (ABA)
- Discrete trial training
- Functional behavior assessment
- Positive behavior support

## Comparison with Other Theories

| Aspect | Behaviorism | Cognitivism | Constructivism |
|--------|-------------|-------------|----------------|
| Focus | Observable behavior | Mental processes | Knowledge construction |
| Learning | Stimulus-response | Information processing | Active discovery |
| Teacher Role | Director | Facilitator | Guide |
| Student Role | Passive recipient | Active processor | Active constructor |`,
          order_index: 3,
          is_preview: false,
          estimated_duration: 40
        }
      ]);

    if (lessonsError2) {
      console.error('Error inserting Educational Psychology lessons:', lessonsError2);
      return;
    }

    console.log('✅ Educational Psychology lessons inserted successfully');

    // Insert demo lessons for Advanced English Literature
    const { error: lessonsError3 } = await supabase
      .from('lessons')
      .insert([
        {
          course_id: '550e8400-e29b-41d4-a716-446655440003',
          title: 'Introduction to English Literature',
          content: `# Introduction to English Literature

## What is Literature?

Literature is the art of written works, especially those considered to have artistic or intellectual value. It encompasses various forms of creative expression through language.

## Major Genres of Literature

### 1. Poetry
- **Epic Poetry**: Long narrative poems (e.g., Paradise Lost)
- **Lyric Poetry**: Personal, emotional expression (e.g., sonnets)
- **Dramatic Poetry**: Poetry written for performance (e.g., verse plays)
- **Narrative Poetry**: Tells a story (e.g., ballads)

### 2. Drama
- **Tragedy**: Serious plays with unhappy endings
- **Comedy**: Humorous plays with happy endings
- **History Plays**: Based on historical events
- **Romance**: Idealized love stories

### 3. Prose Fiction
- **Novels**: Long fictional narratives
- **Short Stories**: Brief fictional narratives
- **Novellas**: Medium-length fictional works

### 4. Non-Fiction
- **Essays**: Short prose compositions
- **Biographies**: Life stories of real people
- **Memoirs**: Personal recollections
- **Travel Writing**: Accounts of journeys

## Historical Periods of English Literature

### Old English Period (450-1066)
- **Characteristics**: Anglo-Saxon culture, oral tradition
- **Major Work**: Beowulf
- **Language**: Old English (very different from modern English)

### Middle English Period (1066-1500)
- **Characteristics**: Norman influence, rise of vernacular literature
- **Major Authors**: Geoffrey Chaucer
- **Major Work**: The Canterbury Tales

### Renaissance Period (1500-1660)
- **Characteristics**: Humanism, classical influence, flowering of drama
- **Major Authors**: William Shakespeare, Christopher Marlowe, Edmund Spenser
- **Major Works**: Hamlet, Doctor Faustus, The Faerie Queene

### Neoclassical Period (1660-1798)
- **Characteristics**: Reason, order, classical models
- **Major Authors**: John Dryden, Alexander Pope, Samuel Johnson
- **Major Works**: The Rape of the Lock, Dictionary of English Language

### Romantic Period (1798-1832)
- **Characteristics**: Emotion, nature, individualism
- **Major Authors**: William Wordsworth, Samuel Taylor Coleridge, Lord Byron
- **Major Works**: Lyrical Ballads, The Rime of the Ancient Mariner

### Victorian Period (1832-1901)
- **Characteristics**: Social realism, moral purpose, industrial society
- **Major Authors**: Charles Dickens, George Eliot, Alfred Tennyson
- **Major Works**: Great Expectations, Middlemarch, In Memoriam

### Modern Period (1901-1945)
- **Characteristics**: Experimentation, psychological realism, fragmentation
- **Major Authors**: T.S. Eliot, Virginia Woolf, James Joyce
- **Major Works**: The Waste Land, Mrs. Dalloway, Ulysses

### Contemporary Period (1945-present)
- **Characteristics**: Diversity, postcolonial voices, postmodernism
- **Major Authors**: Salman Rushdie, Zadie Smith, Ian McEwan
- **Major Works**: Midnight's Children, White Teeth, Atonement

## Literary Devices and Techniques

### Figures of Speech
- **Metaphor**: Direct comparison without "like" or "as"
- **Simile**: Comparison using "like" or "as"
- **Personification**: Giving human qualities to non-human things
- **Alliteration**: Repetition of initial consonant sounds
- **Symbolism**: Using objects to represent ideas

### Narrative Techniques
- **Point of View**: First person, third person, omniscient
- **Stream of Consciousness**: Interior thoughts and feelings
- **Flashback**: Returning to earlier events
- **Foreshadowing**: Hinting at future events
- **Irony**: Contrast between expectation and reality

## Critical Approaches to Literature

### 1. Formalist Criticism
Focuses on the text itself, analyzing structure, style, and literary devices.

### 2. Historical Criticism
Examines literature in its historical context, considering social and cultural factors.

### 3. Biographical Criticism
Relates the work to the author's life and experiences.

### 4. Psychological Criticism
Analyzes characters and authors from psychological perspectives.

### 5. Feminist Criticism
Examines gender roles and women's experiences in literature.

### 6. Postcolonial Criticism
Studies literature from formerly colonized countries and themes of cultural identity.

## Importance of Studying Literature

1. **Cultural Understanding**: Insight into different cultures and time periods
2. **Language Skills**: Enhanced vocabulary and communication abilities
3. **Critical Thinking**: Analysis and interpretation skills
4. **Empathy**: Understanding different perspectives and experiences
5. **Aesthetic Appreciation**: Recognition of artistic beauty and craftsmanship
6. **Historical Knowledge**: Understanding of social and cultural history
7. **Personal Growth**: Self-reflection and emotional development

## Study Tips for Literature

1. **Read Actively**: Take notes, ask questions, make connections
2. **Understand Context**: Research historical and biographical background
3. **Analyze Themes**: Identify recurring ideas and messages
4. **Study Characters**: Examine character development and motivation
5. **Practice Writing**: Develop analytical and creative writing skills
6. **Discuss**: Engage in discussions with others about interpretations
7. **Read Widely**: Explore different genres, periods, and authors`,
          order_index: 1,
          is_preview: true,
          estimated_duration: 35
        },
        {
          course_id: '550e8400-e29b-41d4-a716-446655440003',
          title: 'Shakespeare: Life and Works',
          content: `# William Shakespeare: Life and Works

## Biography (1564-1616)

### Early Life
- Born in Stratford-upon-Avon, England
- Son of John Shakespeare (glove-maker and alderman) and Mary Arden
- Likely attended King's New School in Stratford
- Married Anne Hathaway in 1582 (she was 8 years older)
- Had three children: Susanna and twins Hamnet and Judith

### Career in London
- Moved to London around 1590
- Became actor, playwright, and shareholder in playing companies
- Member of the Lord Chamberlain's Men (later King's Men)
- Part-owner of the Globe Theatre
- Retired to Stratford around 1613

### Death and Legacy
- Died April 23, 1616 (same date as his birth)
- Buried in Holy Trinity Church, Stratford-upon-Avon
- Left behind 37 plays and 154 sonnets

## Major Works

### Tragedies

#### Hamlet (c. 1600-1601)
- **Plot**: Prince of Denmark seeks revenge for his father's murder
- **Themes**: Revenge, madness, mortality, corruption
- **Famous Quotes**: "To be or not to be, that is the question"
- **Key Characters**: Hamlet, Claudius, Gertrude, Ophelia, Polonius

#### Macbeth (c. 1606)
- **Plot**: Scottish general's ambition leads to murder and downfall
- **Themes**: Ambition, guilt, fate vs. free will, appearance vs. reality
- **Famous Quotes**: "Fair is foul, and foul is fair"
- **Key Characters**: Macbeth, Lady Macbeth, Duncan, Banquo, Macduff

#### King Lear (c. 1605-1606)
- **Plot**: Aging king divides kingdom, leading to family tragedy
- **Themes**: Family, power, justice, nature vs. nurture
- **Subplots**: Gloucester and his sons Edgar and Edmund
- **Key Characters**: Lear, Goneril, Regan, Cordelia, Gloucester, Edgar, Edmund

#### Othello (c. 1603)
- **Plot**: Moorish general destroyed by jealousy and manipulation
- **Themes**: Jealousy, racism, manipulation, love and hate
- **Famous Character**: Iago (one of literature's greatest villains)
- **Key Characters**: Othello, Desdemona, Iago, Cassio, Emilia

#### Romeo and Juliet (c. 1595)
- **Plot**: Young lovers from feuding families meet tragic end
- **Themes**: Love, fate, youth vs. age, light vs. dark
- **Famous Quotes**: "Romeo, Romeo, wherefore art thou Romeo?"
- **Key Characters**: Romeo, Juliet, Mercutio, Tybalt, Friar Lawrence

### Comedies

#### A Midsummer Night's Dream (c. 1595-1596)
- **Plot**: Multiple love stories intertwined with fairy magic
- **Themes**: Love, dreams vs. reality, transformation
- **Settings**: Athens and enchanted forest
- **Key Characters**: Puck, Oberon, Titania, Bottom, Helena, Hermia

#### Much Ado About Nothing (c. 1598-1599)
- **Plot**: Two couples navigate love through wit and deception
- **Themes**: Love, honor, deception, gender roles
- **Famous Couple**: Beatrice and Benedick (witty antagonists)
- **Key Characters**: Beatrice, Benedick, Hero, Claudio, Don John

#### The Merchant of Venice (c. 1596-1597)
- **Plot**: Antonio borrows money from Shylock to help friend Bassanio
- **Themes**: Justice vs. mercy, prejudice, friendship, love
- **Famous Speech**: Shylock's "Hath not a Jew eyes?" speech
- **Key Characters**: Shylock, Antonio, Bassanio, Portia, Jessica

#### Twelfth Night (c. 1601-1602)
- **Plot**: Viola disguises herself as a man, creating romantic confusion
- **Themes**: Love, identity, gender, appearance vs. reality
- **Subplot**: Sir Toby Belch and Malvolio
- **Key Characters**: Viola, Orsino, Olivia, Sebastian, Malvolio

### History Plays

#### Richard III (c. 1592-1593)
- **Plot**: Deformed duke's ruthless rise to power
- **Themes**: Ambition, evil, divine justice
- **Famous Opening**: "Now is the winter of our discontent"
- **Character**: Richard as charismatic villain

#### Henry V (c. 1599)
- **Plot**: Young king's transformation and victory at Agincourt
- **Themes**: Leadership, patriotism, war, responsibility
- **Famous Speech**: "Once more unto the breach" and St. Crispin's Day speech
- **Character Development**: From Prince Hal to King Henry

### Late Plays (Romances)

#### The Tempest (c. 1610-1611)
- **Plot**: Prospero uses magic to shipwreck enemies on his island
- **Themes**: Forgiveness, power, colonialism, art vs. nature
- **Characters**: Prospero, Miranda, Ariel, Caliban, Ferdinand
- **Significance**: Often considered Shakespeare's farewell to theater

## Shakespeare's Sonnets

### Structure
- 154 sonnets total
- Shakespearean (English) sonnet form: 14 lines, ABAB CDCD EFEF GG rhyme scheme
- Iambic pentameter

### Major Themes
- **Fair Youth** (Sonnets 1-126): Addressed to a young man
- **Dark Lady** (Sonnets 127-152): Addressed to a mysterious woman
- **Rival Poet** (Sonnets 78-86): Competition with another poet

### Famous Sonnets
- **Sonnet 18**: "Shall I compare thee to a summer's day?"
- **Sonnet 116**: "Let me not to the marriage of true minds"
- **Sonnet 130**: "My mistress' eyes are nothing like the sun"

## Shakespeare's Language and Style

### Characteristics
- **Blank Verse**: Unrhymed iambic pentameter
- **Prose**: For comic characters and lower-class characters
- **Wordplay**: Puns, double meanings, wit
- **Imagery**: Rich metaphors and similes
- **Soliloquies**: Characters' inner thoughts revealed

### Innovations
- Created over 1,700 new words
- Popularized many phrases still used today
- Developed complex psychological characters
- Blended comedy and tragedy

## Critical Interpretations

### Elizabethan Context
- Reflected concerns of Shakespeare's time
- Divine right of kings
- Great Chain of Being
- Religious and political tensions

### Modern Interpretations
- **Psychological**: Freudian and Jungian readings
- **Feminist**: Gender roles and women's agency
- **Postcolonial**: Power dynamics and cultural imperialism
- **New Historicism**: Cultural and historical context

## Shakespeare's Influence

### Literature
- Influenced countless writers across centuries
- Standard for dramatic and poetic excellence
- Source of plots and characters for later works

### Language
- Contributed thousands of words to English
- Created memorable phrases and expressions
- Influenced English literary style

### Theater
- Established conventions still used today
- Globe Theatre reconstruction demonstrates enduring appeal
- Constant adaptation and reinterpretation

### Popular Culture
- Films, TV shows, novels based on his works
- References in music, art, and media
- Educational curriculum worldwide

## Study Approaches

### Reading Strategies
1. **Historical Context**: Understand Elizabethan England
2. **Language**: Use annotated editions for difficult passages
3. **Themes**: Identify recurring ideas across works
4. **Characters**: Analyze motivations and development
5. **Performance**: Remember plays were written for performance

### Analysis Techniques
1. **Close Reading**: Examine language and imagery
2. **Comparative Study**: Compare similar themes across plays
3. **Character Study**: Trace character development
4. **Thematic Analysis**: Explore major themes
5. **Historical Criticism**: Consider contemporary context`,
          order_index: 2,
          is_preview: false,
          estimated_duration: 50
        }
      ]);

    if (lessonsError3) {
      console.error('Error inserting Advanced English Literature lessons:', lessonsError3);
      return;
    }

    console.log('✅ Advanced English Literature lessons inserted successfully');

    // Insert demo lessons for Quantitative Aptitude Basics
    const { error: lessonsError4 } = await supabase
      .from('lessons')
      .insert([
        {
          course_id: '550e8400-e29b-41d4-a716-446655440004',
          title: 'Number Systems and Basic Operations',
          content: `# Number Systems and Basic Operations

## Types of Numbers

### 1. Natural Numbers (N)
- Definition: Counting numbers starting from 1
- Set: {1, 2, 3, 4, 5, ...}
- Properties: Used for counting objects

### 2. Whole Numbers (W)
- Definition: Natural numbers including zero
- Set: {0, 1, 2, 3, 4, 5, ...}
- Properties: Includes zero as the additive identity

### 3. Integers (Z)
- Definition: Whole numbers and their negatives
- Set: {..., -3, -2, -1, 0, 1, 2, 3, ...}
- Properties: Includes positive, negative, and zero

### 4. Rational Numbers (Q)
- Definition: Numbers that can be expressed as p/q where p, q are integers and q ≠ 0
- Examples: 1/2, -3/4, 5, 0.75, 0.333...
- Properties: Include terminating and repeating decimals

### 5. Irrational Numbers
- Definition: Numbers that cannot be expressed as a ratio of integers
- Examples: π, √2, √3, e
- Properties: Non-terminating, non-repeating decimals

### 6. Real Numbers (R)
- Definition: Union of rational and irrational numbers
- Properties: All numbers on the number line

## Basic Operations

### Addition
- **Commutative Property**: a + b = b + a
- **Associative Property**: (a + b) + c = a + (b + c)
- **Identity Element**: a + 0 = a
- **Inverse Element**: a + (-a) = 0

### Subtraction
- **Definition**: a - b = a + (-b)
- **Properties**: Not commutative or associative
- **Examples**: 7 - 3 = 4, but 3 - 7 = -4

### Multiplication
- **Commutative Property**: a × b = b × a
- **Associative Property**: (a × b) × c = a × (b × c)
- **Identity Element**: a × 1 = a
- **Zero Property**: a × 0 = 0
- **Distributive Property**: a × (b + c) = (a × b) + (a × c)

### Division
- **Definition**: a ÷ b = a × (1/b), where b ≠ 0
- **Properties**: Not commutative or associative
- **Division by Zero**: Undefined

## Order of Operations (BODMAS/PEMDAS)

### BODMAS Rule:
1. **B**rackets
2. **O**rders (Powers/Exponents)
3. **D**ivision
4. **M**ultiplication
5. **A**ddition
6. **S**ubtraction

### Examples:
1. 2 + 3 × 4 = 2 + 12 = 14
2. (2 + 3) × 4 = 5 × 4 = 20
3. 2³ + 4 × 5 = 8 + 20 = 28
4. 24 ÷ 6 × 2 = 4 × 2 = 8

## Factors and Multiples

### Factors
- **Definition**: Numbers that divide a given number exactly
- **Example**: Factors of 12 are 1, 2, 3, 4, 6, 12
- **Prime Factors**: Factors that are prime numbers

### Multiples
- **Definition**: Numbers obtained by multiplying a given number by integers
- **Example**: Multiples of 5 are 5, 10, 15, 20, 25, ...

### Prime Numbers
- **Definition**: Numbers greater than 1 with exactly two factors (1 and itself)
- **Examples**: 2, 3, 5, 7, 11, 13, 17, 19, 23, ...
- **Note**: 2 is the only even prime number

### Composite Numbers
- **Definition**: Numbers with more than two factors
- **Examples**: 4, 6, 8, 9, 10, 12, 14, 15, ...

## HCF and LCM

### Highest Common Factor (HCF) / Greatest Common Divisor (GCD)
- **Definition**: Largest number that divides all given numbers
- **Methods**:
  1. **Prime Factorization Method**
  2. **Division Method**
  3. **Euclidean Algorithm**

### Least Common Multiple (LCM)
- **Definition**: Smallest positive number divisible by all given numbers
- **Methods**:
  1. **Prime Factorization Method**
  2. **Division Method**

### Relationship: HCF × LCM = Product of numbers (for two numbers)

### Examples:
Find HCF and LCM of 12 and 18:
- 12 = 2² × 3
- 18 = 2 × 3²
- HCF = 2 × 3 = 6
- LCM = 2² × 3² = 36
- Verification: 6 × 36 = 216 = 12 × 18 ✓

## Divisibility Rules

### Divisibility by 2
Number ends in 0, 2, 4, 6, or 8

### Divisibility by 3
Sum of digits is divisible by 3

### Divisibility by 4
Last two digits form a number divisible by 4

### Divisibility by 5
Number ends in 0 or 5

### Divisibility by 6
Number is divisible by both 2 and 3

### Divisibility by 8
Last three digits form a number divisible by 8

### Divisibility by 9
Sum of digits is divisible by 9

### Divisibility by 10
Number ends in 0

### Divisibility by 11
Alternating sum of digits is divisible by 11

## Practice Problems

### Problem 1
Find the HCF and LCM of 24, 36, and 48.

**Solution:**
- 24 = 2³ × 3
- 36 = 2² × 3²
- 48 = 2⁴ × 3
- HCF = 2² × 3 = 12
- LCM = 2⁴ × 3² = 144

### Problem 2
Simplify: 2 + 3 × (4 + 5) ÷ 3 - 1

**Solution:**
= 2 + 3 × 9 ÷ 3 - 1
= 2 + 27 ÷ 3 - 1
= 2 + 9 - 1
= 10

### Problem 3
Check if 2,346 is divisible by 6.

**Solution:**
For divisibility by 6, number must be divisible by both 2 and 3.
- Divisible by 2: Ends in 6 (even) ✓
- Divisible by 3: Sum of digits = 2+3+4+6 = 15, which is divisible by 3 ✓
- Therefore, 2,346 is divisible by 6.

## Tips for Competitive Exams

1. **Memorize**: First 20 prime numbers, squares up to 25², cubes up to 15³
2. **Practice**: Divisibility rules for quick calculations
3. **Shortcuts**: Learn vedic mathematics techniques
4. **Time Management**: Use approximation when exact values aren't needed
5. **Pattern Recognition**: Look for patterns in number sequences`,
          order_index: 1,
          is_preview: true,
          estimated_duration: 40
        },
        {
          course_id: '550e8400-e29b-41d4-a716-446655440004',
          title: 'Percentages and Applications',
          content: `# Percentages and Applications

## What is Percentage?

### Definition
Percentage means "per hundred" or "out of 100". It is a way of expressing a fraction with denominator 100.

### Symbol
The symbol for percentage is %

### Basic Formula
Percentage = (Part/Whole) × 100

## Converting Between Fractions, Decimals, and Percentages

### Fraction to Percentage
Multiply the fraction by 100
- Example: 3/4 = (3/4) × 100 = 75%

### Decimal to Percentage
Multiply the decimal by 100
- Example: 0.65 = 0.65 × 100 = 65%

### Percentage to Fraction
Divide by 100 and simplify
- Example: 25% = 25/100 = 1/4

### Percentage to Decimal
Divide by 100
- Example: 35% = 35/100 = 0.35

## Important Percentage Equivalents

### Common Fractions
- 1/2 = 50%
- 1/3 = 33.33%
- 2/3 = 66.67%
- 1/4 = 25%
- 3/4 = 75%
- 1/5 = 20%
- 2/5 = 40%
- 3/5 = 60%
- 4/5 = 80%
- 1/8 = 12.5%
- 3/8 = 37.5%
- 5/8 = 62.5%
- 7/8 = 87.5%

## Basic Percentage Calculations

### Finding Percentage of a Number
Formula: (Percentage/100) × Number

**Example 1:** Find 15% of 240
Solution: (15/100) × 240 = 0.15 × 240 = 36

**Example 2:** Find 12.5% of 800
Solution: (12.5/100) × 800 = 0.125 × 800 = 100

### Finding What Percentage One Number is of Another
Formula: (Part/Whole) × 100

**Example 1:** What percentage is 45 of 180?
Solution: (45/180) × 100 = 25%

**Example 2:** What percentage is 72 of 96?
Solution: (72/96) × 100 = 75%

### Finding the Whole When Part and Percentage are Known
Formula: Part ÷ (Percentage/100)

**Example 1:** 30% of what number is 75?
Solution: 75 ÷ (30/100) = 75 ÷ 0.3 = 250

**Example 2:** 15% of what number is 45?
Solution: 45 ÷ (15/100) = 45 ÷ 0.15 = 300

## Percentage Increase and Decrease

### Percentage Increase
Formula: ((New Value - Original Value)/Original Value) × 100

**Example:** Price increased from ₹500 to ₹650. Find percentage increase.
Solution: ((650 - 500)/500) × 100 = (150/500) × 100 = 30%

### Percentage Decrease
Formula: ((Original Value - New Value)/Original Value) × 100

**Example:** Price decreased from ₹800 to ₹600. Find percentage decrease.
Solution: ((800 - 600)/800) × 100 = (200/800) × 100 = 25%

### Successive Percentage Changes
When two percentage changes are applied successively:

**Formula:** If there are two changes of a% and b%, then:
Net change = a + b + (ab/100)

**Example:** A number is increased by 20% and then decreased by 10%. Find net change.
Solution: Net change = 20 + (-10) + (20 × (-10)/100) = 20 - 10 - 2 = 8% increase

## Applications in Real Life

### 1. Profit and Loss

#### Basic Formulas:
- **Profit** = Selling Price - Cost Price
- **Loss** = Cost Price - Selling Price
- **Profit %** = (Profit/Cost Price) × 100
- **Loss %** = (Loss/Cost Price) × 100

#### Finding Selling Price:
- **When Profit %** is given: SP = CP × (100 + Profit%)/100
- **When Loss %** is given: SP = CP × (100 - Loss%)/100

#### Finding Cost Price:
- **When Profit %** is given: CP = SP × 100/(100 + Profit%)
- **When Loss %** is given: CP = SP × 100/(100 - Loss%)

**Example:** A shopkeeper buys an article for ₹800 and sells it for ₹920. Find profit percentage.
Solution: 
- Profit = 920 - 800 = ₹120
- Profit % = (120/800) × 100 = 15%

### 2. Simple Interest

#### Formula:
SI = (Principal × Rate × Time)/100

#### Amount:
Amount = Principal + Simple Interest

**Example:** Find simple interest on ₹5000 at 8% per annum for 3 years.
Solution: SI = (5000 × 8 × 3)/100 = ₹1200

### 3. Discount

#### Basic Formulas:
- **Discount** = Marked Price - Selling Price
- **Discount %** = (Discount/Marked Price) × 100
- **Selling Price** = Marked Price - Discount
- **Selling Price** = Marked Price × (100 - Discount%)/100

**Example:** A shirt marked at ₹1500 is sold at 20% discount. Find selling price.
Solution: SP = 1500 × (100 - 20)/100 = 1500 × 80/100 = ₹1200

### 4. Tax Calculations

#### Sales Tax/VAT:
Tax Amount = (Tax Rate/100) × Price
Total Amount = Price + Tax Amount

**Example:** If VAT is 12% on a purchase of ₹2500, find total amount.
Solution: 
- VAT = (12/100) × 2500 = ₹300
- Total Amount = 2500 + 300 = ₹2800

### 5. Population Growth

#### Formula:
Final Population = Initial Population × (1 + Growth Rate/100)^n

**Example:** A city's population is 50,000. If it grows at 5% per year, what will be the population after 2 years?
Solution: Final Population = 50,000 × (1 + 5/100)² = 50,000 × (1.05)² = 55,125

## Shortcuts and Tricks

### 1. Quick Percentage Calculations
- **10%**: Move decimal point one place left
- **1%**: Move decimal point two places left
- **5%**: Half of 10%
- **25%**: One quarter of the number
- **50%**: Half of the number
- **75%**: Three quarters of the number

### 2. Percentage of Percentage
To find a% of b% of a number:
Result = (a × b × number)/10000

**Example:** Find 15% of 20% of 800
Solution: (15 × 20 × 800)/10000 = 24

### 3. Fractional Method
Convert percentages to fractions for easier calculation:
- 12.5% = 1/8
- 16.67% = 1/6
- 33.33% = 1/3
- 37.5% = 3/8
- 62.5% = 5/8
- 83.33% = 5/6
- 87.5% = 7/8

## Practice Problems

### Problem 1
In an exam, 60% students passed. If 240 students failed, find total number of students.

**Solution:**
If 60% passed, then 40% failed
40% of total = 240
Total = 240 ÷ (40/100) = 240 ÷ 0.4 = 600 students

### Problem 2
A number is increased by 25% and then decreased by 20%. Find the net percentage change.

**Solution:**
Net change = 25 + (-20) + (25 × (-20))/100
= 25 - 20 - 5 = 0%
No net change

### Problem 3
A shopkeeper marks his goods 40% above cost price and gives 15% discount. Find his profit percentage.

**Solution:**
Let CP = 100
MP = 100 + 40 = 140
SP = 140 × (100-15)/100 = 140 × 85/100 = 119
Profit% = (119-100)/100 × 100 = 19%

## Tips for Competitive Exams

1. **Memorize** common percentage-fraction equivalents
2. **Practice** mental calculations for basic percentages
3. **Use approximation** when exact calculations are time-consuming
4. **Learn shortcuts** for successive percentage changes
5. **Understand** the relationship between percentage, profit/loss, and discount problems`,
          order_index: 2,
          is_preview: true,
          estimated_duration: 45
        }
      ]);

    if (lessonsError4) {
      console.error('Error inserting Quantitative Aptitude lessons:', lessonsError4);
      return;
    }

    console.log('✅ Quantitative Aptitude lessons inserted successfully');

    console.log('🎉 All demo data populated successfully!');
    console.log('\nDemo courses created:');
    console.log('1. English Grammar Mastery (5 lessons, first 2 preview)');
    console.log('2. Educational Psychology (3 lessons, first 2 preview)');
    console.log('3. Advanced English Literature (2 lessons, first 1 preview)');
    console.log('4. Quantitative Aptitude Basics (2 lessons, both preview)');

  } catch (error) {
    console.error('Error populating demo data:', error);
  }
}

populateDemoData();